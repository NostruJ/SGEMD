import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const AdminVerEmprendimiento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emprendimiento, setEmprendimiento] = useState(null);
  const [estudiante, setEstudiante] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [avance, setAvance] = useState({ total: 0, completadas: 0, avance: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTarea, setNewTarea] = useState({ Titulo: '', Descripcion: '', FechaLimite: '' });

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders();
      
      const [empRes, tareasRes, avanceRes] = await Promise.all([
        fetch(`${API_URL}/segmed/entrepreneurship/${id}`, { headers, credentials: 'include' }),
        fetch(`${API_URL}/segmed/tareas/emprendimiento/${id}`, { headers }),
        fetch(`${API_URL}/segmed/tareas/avance/emprendimiento/${id}`, { headers })
      ]);

      const empData = await empRes.json();
      const tareasData = await tareasRes.json();
      const avanceData = await avanceRes.json();

      if (empData.success) {
        setEmprendimiento(empData.data);
        
        if (empData.data.Usuarios_idUsuarios) {
          const userRes = await fetch(`${API_URL}/segmed/users/${empData.data.Usuarios_idUsuarios}`, { headers });
          const userData = await userRes.json();
          if (userData.success) setEstudiante(userData.data);
        }
      }

      setTareas(tareasData.data || []);
      setAvance(avanceData.data || { total: 0, completadas: 0, avance: 0 });
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearTarea = async (e) => {
    e.preventDefault();
    
    const usuarioId = estudiante?.idusuarios || estudiante?.idUsuarios;
    if (!usuarioId) {
      alert('No hay un estudiante asignado a este emprendimiento. Asigna uno primero antes de crear tareas.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/segmed/tareas`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...newTarea,
          FechaLimite: newTarea.FechaLimite,
          Emprendimiento_idEmprendimiento: parseInt(id),
          Usuario_idUsuarios: usuarioId
        }),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        alert('Tarea creada');
        setShowModal(false);
        setNewTarea({ Titulo: '', Descripcion: '', FechaLimite: '' });
        fetchData();
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleCompletarTarea = async (tareaId) => {
    try {
      const res = await fetch(`${API_URL}/segmed/tareas/${tareaId}/completar`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'pendiente': '#ffc400',
      'completada': '#4CAF50',
      'vencida': '#dc3545'
    };
    return colores[estado] || '#6c757d';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-CO');
  };

  const etapasData = [
    { name: 'Completadas', value: avance.completadas, color: '#4CAF50' },
    { name: 'Pendientes', value: Math.max(0, avance.total - avance.completadas), color: '#ffc400' }
  ];

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
      <div className="mb-3">
        <button 
          className="btn btn-link" 
          onClick={() => navigate('/admin/emprendimientos/plan-de-trabajo')}
          style={{ color: '#1a75bc', textDecoration: 'none' }}
        >
          ← Volver al Plan de Trabajo
        </button>
      </div>

      <div className="row">
        {/* Información del Emprendimiento */}
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header" style={{ backgroundColor: '#0c4a6e', color: 'white' }}>
              <h4 style={{ margin: 0 }}>📋 {emprendimiento?.Nombre}</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Tipo:</strong> {emprendimiento?.TipoEmprendimiento}</p>
                  <p><strong>Sector:</strong> {emprendimiento?.SectorProductivo}</p>
                  <p><strong>Fecha Creación:</strong> {formatDate(emprendimiento?.FechaCreacion)}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Estudiante:</strong> {estudiante?.Nombre || 'No asignado'}</p>
                  <p><strong>Email:</strong> {estudiante?.CorreoInstitucional || '-'}</p>
                  <p><strong>Etapa:</strong> #{emprendimiento?.EtapaEmprendimiento_idEtapaEmprendimiento}</p>
                </div>
              </div>
              <div className="mt-3">
                <strong>Descripción:</strong>
                <p className="text-muted">{emprendimiento?.Descripcion || 'Sin descripción'}</p>
              </div>
            </div>
          </div>

          {/* Lista de Tareas */}
          <div className="card">
            <div className="card-header" style={{ backgroundColor: '#1a75bc', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 style={{ margin: 0 }}>📝 Tareas</h5>
              <button 
                className="btn btn-sm"
                style={{ backgroundColor: '#ffc400', color: '#333' }}
                onClick={() => setShowModal(true)}
              >
                + Nueva Tarea
              </button>
            </div>
            <div className="card-body">
              {tareas.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No hay tareas creadas</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead style={{ backgroundColor: '#f4f4f4' }}>
                      <tr>
                        <th>Título</th>
                        <th>Fecha Límite</th>
                        <th>Estado</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tareas.map(tarea => (
                        <tr key={tarea.idTareas}>
                          <td>
                            <strong>{tarea.Titulo}</strong>
                            {tarea.Descripcion && (
                              <p className="text-muted mb-0" style={{ fontSize: '12px' }}>
                                {tarea.Descripcion.substring(0, 50)}...
                              </p>
                            )}
                          </td>
                          <td>{formatDate(tarea.FechaLimite)}</td>
                          <td>
                            <span style={{ 
                              padding: '4px 12px', 
                              borderRadius: '12px', 
                              backgroundColor: getEstadoColor(tarea.Estado),
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {tarea.Estado}
                            </span>
                          </td>
                          <td>
                            {tarea.Estado !== 'completada' && (
                              <button 
                                className="btn btn-sm"
                                style={{ backgroundColor: '#4CAF50', color: 'white' }}
                                onClick={() => handleCompletarTarea(tarea.idTareas)}
                              >
                                ✓ Completar
                              </button>
                            )}
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

        {/* Gráfico de Avance */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header" style={{ backgroundColor: '#0c4a6e', color: 'white' }}>
              <h5 style={{ margin: 0 }}>📊 Avance</h5>
            </div>
            <div className="card-body text-center">
              <div style={{ width: '150px', height: '150px', margin: '0 auto' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={etapasData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      dataKey="value"
                    >
                      {etapasData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <h2 style={{ color: '#0c4a6e', marginTop: '10px' }}>{avance.avance}%</h2>
              <p className="text-muted">
                {avance.completadas} de {avance.total} tareas completadas
              </p>
            </div>
          </div>

          {/* Tareas Vencidas */}
          {tareas.filter(t => t.Estado === 'vencida').length > 0 && (
            <div className="card mt-3" style={{ borderLeft: '4px solid #dc3545' }}>
              <div className="card-header" style={{ backgroundColor: '#dc3545', color: 'white' }}>
                <h5 style={{ margin: 0 }}>⚠️ Tareas Vencidas</h5>
              </div>
              <div className="card-body">
                {tareas.filter(t => t.Estado === 'vencida').map(tarea => (
                  <div key={tarea.idTareas} className="mb-2 pb-2" style={{ borderBottom: '1px solid #eee' }}>
                    <strong>{tarea.Titulo}</strong>
                    <p className="mb-0 text-danger" style={{ fontSize: '12px' }}>
                      Venció el {formatDate(tarea.FechaLimite)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nueva Tarea */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#0c4a6e', color: 'white' }}>
                <h5 className="modal-title">➕ Nueva Tarea</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCrearTarea}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Título *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newTarea.Titulo}
                      onChange={(e) => setNewTarea({ ...newTarea, Titulo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={newTarea.Descripcion}
                      onChange={(e) => setNewTarea({ ...newTarea, Descripcion: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fecha Límite *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newTarea.FechaLimite}
                      onChange={(e) => setNewTarea({ ...newTarea, FechaLimite: e.target.value })}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">Crear Tarea</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerEmprendimiento;
