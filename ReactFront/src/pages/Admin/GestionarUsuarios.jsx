import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

export default function GestionarUsuarios({ role }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        Nombre: '',
        CorreoInstitucional: '',
        Password: '',
        Roles_idRoles1: role === 'estudiante' ? 2 : 3,
        Estado: 1
    });

    const roleId = role === 'estudiante' ? 2 : 3;
    const endpoint = role === 'estudiante' ? 'students' : 'teachers';
    const title = role === 'estudiante' ? 'Gestión de Estudiantes' : 'Gestión de Docentes';

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            // apiFetch handles the token and headers automatically
            const res = await apiFetch(`${API_URL}/segmed/users/${endpoint}`);
            if (res && res.data) {
                setUsers(res.data);
            } else {
                setUsers([]);
            }
        } catch (err) {
            console.error('Error cargando usuarios', err);
            setError(err.message || 'Error al cargar usuarios. Por favor intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [role]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                // Edit
                const res = await apiFetch(`${API_URL}/segmed/users/${editingUser.idUsuarios}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
                if (res.success || res.message) {
                    alert('Usuario actualizado correctamente');
                    setShowModal(false);
                    fetchUsers();
                } else {
                    alert(res.error || 'Error al actualizar');
                }
            } else {
                // Create
                const dataToSend = { ...formData, Roles_idRoles1: roleId };
                const res = await apiFetch(`${API_URL}/segmed/users/admin`, {
                    method: 'POST',
                    body: JSON.stringify(dataToSend)
                });
                if (res.success || res.data) {
                    alert('Usuario creado correctamente');
                    setShowModal(false);
                    fetchUsers();
                } else {
                    alert(res.error || 'Error al crear');
                }
            }
        } catch (err) {
            console.error(err);
            alert('Error al guardar usuario: ' + err.message);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            Nombre: user.Nombre,
            CorreoInstitucional: user.CorreoInstitucional,
            Password: '', // Don't show password
            Roles_idRoles1: user.Roles_idRoles1,
            Estado: user.Estado
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Desea eliminar este usuario definitivamente? Esta acción no se puede deshacer.')) return;
        try {
            const res = await apiFetch(`${API_URL}/segmed/users/${id}/hard`, {
                method: 'DELETE'
            });
            if (res.success || res.message) {
                fetchUsers();
            } else {
                alert(res.error || 'Error');
            }
        } catch (err) {
            console.error(err);
            alert('Error al eliminar usuario');
        }
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({
            Nombre: '',
            CorreoInstitucional: '',
            Password: '',
            Roles_idRoles1: roleId,
            Estado: 1
        });
        setShowModal(true);
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                    <h4 className="mb-0 text-primary">{title}</h4>
                    <button onClick={openCreateModal} className="btn btn-primary">
                        <i className="bi bi-plus-lg me-2"></i>
                        + Nuevo {role === 'estudiante' ? 'Estudiante' : 'Docente'}
                    </button>
                </div>

                <div className="card-body">
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Avatar</th>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((u) => (
                                            <tr key={u.idUsuarios}>
                                                <td>
                                                    {u.img_perfil ? (
                                                        <img
                                                            src={`${API_URL}${u.img_perfil}`}
                                                            alt="avatar"
                                                            width={40}
                                                            height={40}
                                                            className="rounded-circle border"
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="rounded-circle bg-light d-flex align-items-center justify-content-center text-secondary border"
                                                            style={{ width: 40, height: 40 }}
                                                        >
                                                            <span style={{ fontSize: '1.2rem' }}>👤</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="fw-medium">{u.Nombre}</td>
                                                <td>{u.CorreoInstitucional}</td>
                                                <td>
                                                    <span className={`badge rounded-pill ${u.Estado === 1 ? 'bg-success' : 'bg-secondary'}`}>
                                                        {u.Estado === 1 ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(u)}>
                                                        Editar
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u.idUsuarios)}>
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4 text-muted">
                                                No hay usuarios registrados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <>
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Nombre Completo</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="Nombre"
                                                value={formData.Nombre}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Ej: Juan Pérez"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Correo Institucional</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="CorreoInstitucional"
                                                value={formData.CorreoInstitucional}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="ejemplo@institucion.edu"
                                            />
                                        </div>
                                        {!editingUser && (
                                            <div className="mb-3">
                                                <label className="form-label">Contraseña</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    name="Password"
                                                    value={formData.Password}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="********"
                                                />
                                            </div>
                                        )}
                                        {editingUser && (
                                            <div className="mb-3">
                                                <label className="form-label">Contraseña <small className="text-muted">(Dejar en blanco para mantener actual)</small></label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    name="Password"
                                                    value={formData.Password}
                                                    onChange={handleInputChange}
                                                    placeholder="********"
                                                />
                                            </div>
                                        )}
                                        <div className="mb-3">
                                            <label className="form-label">Estado</label>
                                            <select
                                                className="form-select"
                                                name="Estado"
                                                value={formData.Estado}
                                                onChange={handleInputChange}
                                            >
                                                <option value={1}>Activo</option>
                                                <option value={0}>Inactivo</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                        <button type="submit" className="btn btn-primary">
                                            {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    );
}
