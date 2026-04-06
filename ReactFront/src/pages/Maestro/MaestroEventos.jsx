import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const MaestroEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [tiposEvento, setTiposEvento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editEvento, setEditEvento] = useState(null);
  const [form, setForm] = useState({
    Nombre: '',
    Descripcion: '',
    Tipo: '',
    Estado: 'activo',
    Capacidad: 50,
    Requiere_registro: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders();
      
      const [eventsRes, tiposRes] = await Promise.all([
        fetch(`${API_URL}/segmed/event`, { headers }),
        fetch(`${API_URL}/segmed/type-event`, { headers })
      ]);

      const eventsData = await eventsRes.json();
      const tiposData = await tiposRes.json();

      setEventos(eventsData.data || []);
      setTiposEvento(tiposData.data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    return new Date(dateStr).toLocaleDateString('es-CO', { 
      day: '2-digit', month: 'short', year: 'numeric' 
    });
  };

  const getTipoNombre = (tipo) => {
    if (!tipo) return 'General';
    if (tipo.Academico === '1' || tipo.Academico === 1) return 'Académico';
    if (tipo.Cultura === '1' || tipo.Cultura === 1) return 'Cultura';
    if (tipo.Deportivo === '1' || tipo.Deportivo === 1) return 'Deportivo';
    if (tipo.Social === '1' || tipo.Social === 1) return 'Social';
    if (tipo.Conferencia === '1' || tipo.Conferencia === 1) return 'Conferencia';
    return 'General';
  };

  const getTipoNombreFromId = (tipoId) => {
    const tipo = tiposEvento.find(t => t.idTipo_evento === tipoId || t.idTipoEvento === tipoId);
    return getTipoNombre(tipo);
  };

  const getEstadoBadge = (estado) => {
    const estilos = {
      'activo': { bg: '#4CAF50', texto: 'white', label: 'Activo' },
      'inactivo': { bg: '#6c757d', texto: 'white', label: 'Inactivo' },
      'finalizado': { bg: '#dc3545', texto: 'white', label: 'Finalizado' },
      'proximo': { bg: '#1a75bc', texto: 'white', label: 'Próximo' }
    };
    const estilo = estilos[estado] || estilos['proximo'];
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = getAuthHeaders();
      let res;
      
      if (editEvento) {
        res = await fetch(`${API_URL}/segmed/event/${editEvento.idEventos}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(form),
          credentials: 'include'
        });
      } else {
        res = await fetch(`${API_URL}/segmed/event`, {
          method: 'POST',
          headers,
          body: JSON.stringify(form),
          credentials: 'include'
        });
      }
      const data = await res.json();
      
      if (data.success) {
        alert(editEvento ? 'Evento actualizado' : 'Evento creado');
        setShowModal(false);
        setEditEvento(null);
        setForm({ Nombre: '', Descripcion: '', Tipo: '', Estado: 'activo', Capacidad: 50, Requiere_registro: 1 });
        fetchData();
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
      Nombre: evento.Nombre_evento || '',
      Descripcion: evento.Descripcion_evento || '',
      Tipo: evento.Tipo_evento_idTipo_evento || '',
      Estado: evento.Estado || 'activo',
      Capacidad: evento.Capacidad_maxima || 50,
      Requiere_registro: evento.Requiere_registro || 1
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
        fetchData();
      }
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const openCreateModal = () => {
    setEditEvento(null);
    setForm({ Nombre: '', Descripcion: '', Tipo: '', Estado: 'activo', Capacidad: 50, Requiere_registro: 1 });
    setShowModal(true);
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
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#0c4a6e', marginBottom: '5px' }}>📅 Eventos</h1>
          <p style={{ color: '#666', margin: 0 }}>Gestión de eventos académicos</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal} style={{ backgroundColor: '#1a75bc' }}>
          + Crear Evento
        </button>
      </div>

      {eventos.length === 0 ? (
        <div className="card">
          <div className="card-body text-center" style={{ padding: '50px' }}>
            <p style={{ fontSize: '48px', marginBottom: '15px' }}>📭</p>
            <p style={{ color: '#666', fontSize: '18px' }}>No hay eventos registrados</p>
            <button className="btn btn-primary" onClick={openCreateModal} style={{ backgroundColor: '#1a75bc' }}>
              Crear Primer Evento
            </button>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Tipo</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento) => (
                <tr key={evento.idEventos}>
                  <td style={{ fontWeight: '500', color: '#0c4a6e' }}>{evento.Nombre_evento}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {evento.Descripcion_evento || 'Sin descripción'}
                  </td>
                  <td>{getTipoNombreFromId(evento.Tipo_evento_idTipo_evento)}</td>
                  <td>{evento.Capacidad_maxima || 'N/A'}</td>
                  <td>{getEstadoBadge(evento.Estado)}</td>
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

      {showModal && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header" style={{ backgroundColor: '#0c4a6e', color: 'white' }}>
                  <h5 className="modal-title">{editEvento ? 'Editar Evento' : 'Crear Evento'}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Nombre del Evento</label>
                      <input type="text" className="form-control" name="Nombre" value={form.Nombre} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Descripción</label>
                      <textarea className="form-control" name="Descripcion" rows="3" value={form.Descripcion} onChange={handleChange} />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Tipo de Evento</label>
                        <select className="form-select" name="Tipo" value={form.Tipo} onChange={handleChange}>
                          <option value="">Seleccionar...</option>
                          {tiposEvento.map(tipo => (
                            <option key={tipo.idTipo_evento || tipo.idTipoEvento} value={tipo.idTipo_evento || tipo.idTipoEvento}>
                              {getTipoNombre(tipo)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Estado</label>
                        <select className="form-select" name="Estado" value={form.Estado} onChange={handleChange}>
                          <option value="activo">Activo</option>
                          <option value="proximo">Próximo</option>
                          <option value="inactivo">Inactivo</option>
                          <option value="finalizado">Finalizado</option>
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Capacidad Máxima</label>
                        <input type="number" className="form-control" name="Capacidad" value={form.Capacidad} onChange={handleChange} min="1" />
                      </div>
                      <div className="col-md-6 mb-3 d-flex align-items-center">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" name="Requiere_registro" checked={form.Requiere_registro === 1} onChange={(e) => setForm(prev => ({ ...prev, Requiere_registro: e.target.checked ? 1 : 0 }))} id="requiereRegistro" />
                          <label className="form-check-label" htmlFor="requiereRegistro">
                            Requiere registro previo
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#1a75bc' }}>{editEvento ? 'Guardar' : 'Crear'}</button>
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

export default MaestroEventos;