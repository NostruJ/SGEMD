import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const AdminEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editEvento, setEditEvento] = useState(null);
  const [form, setForm] = useState({
    Nombre: '',
    Descripcion: '',
    Fecha: '',
    Hora: '',
    Lugar: '',
    Tipo: '',
    Estado: 'activo'
  });

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const res = await fetch(`${API_URL}/segmed/event`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      
      if (data.success) {
        setEventos(data.data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editEvento) {
        res = await fetch(`${API_URL}/segmed/event/${editEvento.idEventos}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(form),
          credentials: 'include'
        });
      } else {
        res = await fetch(`${API_URL}/segmed/event`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(form),
          credentials: 'include'
        });
      }
      const data = await res.json();
      
      if (data.success) {
        alert(editEvento ? 'Evento actualizado' : 'Evento creado');
        setShowModal(false);
        setEditEvento(null);
        setForm({ Nombre: '', Descripcion: '', Fecha: '', Hora: '', Lugar: '', Tipo: '', Estado: 'activo' });
        fetchEventos();
      } else {
        alert(data.error || 'Error');
      }
    } catch (err) {
      alert('Error al guardar');
    }
  };

  const handleEdit = (evento) => {
    setEditEvento(evento);
    setForm({
      Nombre: evento.Nombre || '',
      Descripcion: evento.Descripcion || '',
      Fecha: evento.Fecha || '',
      Hora: evento.Hora || '',
      Lugar: evento.Lugar || '',
      Tipo: evento.Tipo || '',
      Estado: evento.Estado || 'activo'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este evento?')) return;
    try {
      const res = await fetch(`${API_URL}/segmed/event/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        fetchEventos();
      }
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const openCreateModal = () => {
    setEditEvento(null);
    setForm({ Nombre: '', Descripcion: '', Fecha: '', Hora: '', Lugar: '', Tipo: '', Estado: 'activo' });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0 text-primary">Gestión de Eventos</h4>
          <button className="btn btn-primary" onClick={openCreateModal}>
            + Crear Evento
          </button>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          {eventos.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No hay eventos registrados</p>
              <button className="btn btn-primary" onClick={openCreateModal}>
                Crear Primer Evento
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Fecha</th>
                    <th>Lugar</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {eventos.map((evento, idx) => (
                    <tr key={idx}>
                      <td>{evento.Nombre}</td>
                      <td>{evento.Fecha}</td>
                      <td>{evento.Lugar || 'N/A'}</td>
                      <td>{evento.Tipo || 'General'}</td>
                      <td>
                        <span className={`badge ${evento.Estado === 'activo' ? 'bg-success' : 'bg-secondary'}`}>
                          {evento.Estado || 'Activo'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(evento)}>
                          Editar
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(evento.idEventos)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editEvento ? 'Editar Evento' : 'Crear Evento'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Nombre</label>
                      <input type="text" className="form-control" name="Nombre" value={form.Nombre} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Descripción</label>
                      <textarea className="form-control" name="Descripcion" rows="3" value={form.Descripcion} onChange={handleChange} />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Fecha</label>
                        <input type="date" className="form-control" name="Fecha" value={form.Fecha} onChange={handleChange} required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Hora</label>
                        <input type="time" className="form-control" name="Hora" value={form.Hora} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Lugar</label>
                        <input type="text" className="form-control" name="Lugar" value={form.Lugar} onChange={handleChange} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Tipo</label>
                        <select className="form-select" name="Tipo" value={form.Tipo} onChange={handleChange}>
                          <option value="">Seleccionar...</option>
                          <option value="Charla">Charla</option>
                          <option value="Taller">Taller</option>
                          <option value="Seminario">Seminario</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Estado</label>
                      <select className="form-select" name="Estado" value={form.Estado} onChange={handleChange}>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">{editEvento ? 'Guardar' : 'Crear'}</button>
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
};

export default AdminEventos;
