import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const Asesorias = () => {
  const [asesorias, setAsesorias] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dropdownAbierto, setDropdownAbierto] = useState(null);
  const [asesoriaSeleccionada, setAsesoriaSeleccionada] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders();
      
      const [asesoriasRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/segmed/advice`, { headers, credentials: 'include' }),
        fetch(`${API_URL}/segmed/users`, { headers })
      ]);

      const asesoriasData = await asesoriasRes.json();
      const usersData = await usersRes.json();

      if (asesoriasData.success) {
        setAsesorias(asesoriasData.data || []);
      }
      if (usersData.success && usersData.data) {
        const estudiantesFiltrados = usersData.data.filter(u => u.Roles_idRoles1 === 2);
        setEstudiantes(estudiantesFiltrados);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar asesorías');
    } finally {
      setLoading(false);
    }
  };

  const getEstudianteNombre = (estudianteId) => {
    const estudiante = estudiantes.find(e => e.idusuarios === estudianteId || e.idUsuarios === estudianteId);
    return estudiante?.Nombre || 'Estudiante';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    return new Date(dateStr).toLocaleDateString('es-CO', { 
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getEstadoBadge = (estado) => {
    const estilos = {
      'pendiente': { bg: '#ffc400', texto: '#333', label: 'Pendiente' },
      'confirmada': { bg: '#1a75bc', texto: 'white', label: 'Confirmada' },
      'completada': { bg: '#4CAF50', texto: 'white', label: 'Completada' },
      'cancelada': { bg: '#dc3545', texto: 'white', label: 'Cancelada' }
    };
    const estilo = estilos[estado] || estilos['pendiente'];
    return (
      <span style={{ 
        padding: '4px 12px', 
        borderRadius: '12px', 
        backgroundColor: estilo.bg, 
        color: estilo.texto,
        fontSize: '12px',
        fontWeight: '500'
      }}>
        {estilo.label}
      </span>
    );
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    setDropdownAbierto(null);
    try {
      const res = await fetch(`${API_URL}/segmed/advice/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          confirmacion: nuevoEstado,
          Fecha_actualizacion: new Date().toISOString().split('T')[0]
        }),
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        fetchData();
      } else {
        setError(data.error || 'Error al actualizar estado');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al actualizar estado');
    }
  };

  const toggleDropdown = (id) => {
    setDropdownAbierto(dropdownAbierto === id ? null : id);
  };

  const verDetalles = (asesoria) => {
    setAsesoriaSeleccionada(asesoria);
  };

  const cerrarDetalles = () => {
    setAsesoriaSeleccionada(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Modal de detalles de asesoría */}
      {asesoriaSeleccionada && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
            <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#0c4a6e', color: 'white' }}>
              <h5 className="mb-0">📋 Detalles de Asesoría</h5>
              <button type="button" className="btn-close btn-close-white" onClick={cerrarDetalles}></button>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong>Nombre:</strong>
                <p className="mb-0">{asesoriaSeleccionada.Nombre_de_asesoria}</p>
              </div>
              <div className="mb-3">
                <strong>Fecha:</strong>
                <p className="mb-0">{formatDate(asesoriaSeleccionada.Fecha_asesoria)}</p>
              </div>
              <div className="mb-3">
                <strong>Estudiante:</strong>
                <p className="mb-0">{getEstudianteNombre(asesoriaSeleccionada.Usuarios_idUsuarios)}</p>
              </div>
              <div className="mb-3">
                <strong>Estado:</strong>
                <p className="mb-0">{getEstadoBadge(asesoriaSeleccionada.confirmacion)}</p>
              </div>
              <div className="mb-3">
                <strong>Descripción:</strong>
                <p className="mb-0" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {asesoriaSeleccionada.Descripcion || 'Sin descripción'}
                </p>
              </div>
              {asesoriaSeleccionada.Comentarios && (
                <div className="mb-3">
                  <strong>Comentarios:</strong>
                  <p className="mb-0" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {asesoriaSeleccionada.Comentarios}
                  </p>
                </div>
              )}
            </div>
            <div className="card-footer">
              <button className="btn btn-secondary" onClick={cerrarDetalles}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#0c4a6e', color: 'white' }}>
          <h4 className="mb-0">📚 Gestión de Asesorías</h4>
          <Link to="/maestro/asesorias/crear" className="btn btn-light btn-sm">
            + Nueva Asesoría
          </Link>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          {asesorias.length === 0 ? (
            <div className="text-center py-5">
              <p style={{ fontSize: '48px', marginBottom: '15px' }}>📭</p>
              <p className="text-muted">No hay asesorías registradas</p>
              <Link to="/maestro/asesorias/crear" className="btn btn-primary">
                Crear Primera Asesoría
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead style={{ backgroundColor: '#f4f4f4' }}>
                  <tr>
                    <th>Nombre</th>
                    <th>Fecha</th>
                    <th>Estudiante</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th style={{ width: '180px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {asesorias.map((asesoria) => (
                    <tr key={asesoria.idAsesorias}>
                      <td style={{ fontWeight: '500' }}>{asesoria.Nombre_de_asesoria}</td>
                      <td>{formatDate(asesoria.Fecha_asesoria)}</td>
                      <td>{getEstudianteNombre(asesoria.Usuarios_idUsuarios)}</td>
                      <td>
                        <div style={{ maxWidth: '250px' }}>
                          <span style={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {asesoria.Descripcion || 'Sin descripción'}
                          </span>
                          {asesoria.Descripcion && asesoria.Descripcion.length > 100 && (
                            <button 
                              className="btn btn-link btn-sm p-0" 
                              onClick={() => verDetalles(asesoria)}
                              style={{ fontSize: '12px' }}
                            >
                              Ver más
                            </button>
                          )}
                        </div>
                      </td>
                      <td>{getEstadoBadge(asesoria.confirmacion)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-info" 
                            onClick={() => verDetalles(asesoria)}
                            title="Ver detalles"
                          >
                            👁️
                          </button>
                          <div className="dropdown" style={{ position: 'relative' }}>
                          <button 
                            className="btn btn-sm btn-outline-secondary dropdown-toggle" 
                            type="button"
                            onClick={() => toggleDropdown(asesoria.idAsesorias)}
                          >
                            Gestionar
                          </button>
                          <ul 
                            className={`dropdown-menu${dropdownAbierto === asesoria.idAsesorias ? ' show' : ''}`}
                            style={{ 
                              position: 'absolute', 
                              zIndex: 1000,
                              display: dropdownAbierto === asesoria.idAsesorias ? 'block' : 'none'
                            }}
                          >
                            <li><button className="dropdown-item" onClick={() => handleCambiarEstado(asesoria.idAsesorias, 'confirmada')}>✓ Confirmar</button></li>
                            <li><button className="dropdown-item" onClick={() => handleCambiarEstado(asesoria.idAsesorias, 'completada')}>✓ Completar</button></li>
                            <li><button className="dropdown-item text-danger" onClick={() => handleCambiarEstado(asesoria.idAsesorias, 'cancelada')}>✗ Cancelar</button></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><Link className="dropdown-item" to={`/maestro/asesorias/editar?id=${asesoria.idAsesorias}`}>Editar</Link></li>
                          </ul>
                        </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Asesorias;
