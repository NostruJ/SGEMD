import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const MaestroTareas = () => {
  const location = useLocation();
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [avance, setAvance] = useState({ total: 0, completadas: 0, avance: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTarea, setNewTarea] = useState({ Titulo: '', Descripcion: '', FechaLimite: '', EstudianteId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders();
      
      const [empRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/segmed/entrepreneurship`, { headers, credentials: 'include' }),
        fetch(`${API_URL}/segmed/users`, { headers })
      ]);

      const empData = await empRes.json();
      const usersData = await usersRes.json();

      const usuarios = usersData.data || [];
      const estudiantesAll = usuarios.filter(u => u.Roles_idRoles1 === 2);
      setEstudiantes(estudiantesAll);
      
      const emprendimientosAll = empData.data || [];
      setEmprendimientos(emprendimientosAll);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmprendimiento = async (empId) => {
    setSelectedEmp(empId);
    try {
      const headers = getAuthHeaders();
      
      const [tareasRes, avanceRes] = await Promise.all([
        fetch(`${API_URL}/segmed/tareas/emprendimiento/${empId}`, { headers }),
        fetch(`${API_URL}/segmed/tareas/avance/emprendimiento/${empId}`, { headers })
      ]);

      const tareasData = await tareasRes.json();
      const avanceData = await avanceRes.json();

      setTareas(tareasData.data || []);
      setAvance(avanceData.data || { total: 0, completadas: 0, avance: 0 });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleCrearTarea = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/segmed/tareas`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...newTarea,
          Emprendimiento_idEmprendimiento: selectedEmp,
          Usuario_idUsuarios: parseInt(newTarea.EstudianteId)
        }),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        alert('Tarea creada');
        setShowModal(false);
        setNewTarea({ Titulo: '', Descripcion: '', FechaLimite: '', EstudianteId: '' });
        handleSelectEmprendimiento(selectedEmp);
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
        handleSelectEmprendimiento(selectedEmp);
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

  const getEstudianteNombre = (userId) => {
    const est = estudiantes.find(e => (e.idusuarios || e.idUsuarios) === userId);
    return est?.Nombre || 'Estudiante';
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
      <div className="card">
        <div className="card-header" style={{ backgroundColor: '#0c4a6e', color: 'white' }}>
          <h4 style={{ margin: 0 }}>📝 Gestión de Tareas</h4>
        </div>
        <div className="card-body">
          {/* Seleccionar Emprendimiento */}
          <div className="mb-4">
            <label className="form-label" style={{ fontWeight: 'bold', color: '#0c4a6e' }}>
              Seleccionar Emprendimiento *
            </label>
            <select 
              className="form-select"
              value={selectedEmp || ''}
              onChange={(e) => handleSelectEmprendimiento(e.target.value)}
            >
              <option value="">Seleccionar...</option>
              {emprendimientos.map(emp => (
                <option key={emp.idEmprendimiento} value={emp.idEmprendimiento}>
                  {emp.Nombre} - {emp.SectorProductivo}
                </option>
              ))}
            </select>
          </div>

          {selectedEmp && (
            <>
              <div className="d-flex justify-content-end mb-3">
                <button 
                  className="btn btn-primary"
                  style={{ backgroundColor: '#1a75bc' }}
                  onClick={() => setShowModal(true)}
                >
                  ➕ Nueva Tarea
                </button>
              </div>

              <div className="row">
                {/* Lista de Tareas */}
                <div className="col-md-8">
                  <div className="card">
                    <div className="card-header" style={{ backgroundColor: '#1a75bc', color: 'white' }}>
                      <h5 style={{ margin: 0 }}>Lista de Tareas</h5>
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
                                <th>Estudiante</th>
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
                                        {tarea.Descripcion.substring(0, 40)}...
                                      </p>
                                    )}
                                  </td>
                                  <td>{getEstudianteNombre(tarea.Usuario_idUsuarios)}</td>
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
                </div>
              </div>
            </>
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
                    <label className="form-label">Estudiante *</label>
                    <select
                      className="form-select"
                      value={newTarea.EstudianteId}
                      onChange={(e) => setNewTarea({ ...newTarea, EstudianteId: e.target.value })}
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {estudiantes.map(est => (
                        <option key={est.idusuarios || est.idUsuarios} value={est.idusuarios || est.idUsuarios}>
                          {est.Nombre}
                        </option>
                      ))}
                    </select>
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

export default MaestroTareas;
