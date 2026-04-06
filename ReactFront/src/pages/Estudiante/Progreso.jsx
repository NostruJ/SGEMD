import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const Progreso = () => {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [emprendimientoSeleccionado, setEmprendimientoSeleccionado] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [avances, setAvances] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders();
      
      const [userRes, empRes] = await Promise.all([
        fetch(`${API_URL}/segmed/users/me`, { headers, credentials: 'include' }),
        fetch(`${API_URL}/segmed/entrepreneurship`, { headers })
      ]);

      const userData = await userRes.json();
      const empData = await empRes.json();

      const emprendimientosData = empData.data || [];
      const userId = userData.data?.idusuarios || userData.data?.idUsuarios;
      const misEmprendimientos = emprendimientosData.filter(e => e.Usuarios_idUsuarios === userId);
      
      setEmprendimientos(misEmprendimientos);
      
      if (misEmprendimientos.length > 0) {
        setEmprendimientoSeleccionado(misEmprendimientos[0]);
        
        const avancesObj = {};
        for (const emp of misEmprendimientos) {
          try {
            const avanceRes = await fetch(`${API_URL}/segmed/tareas/avance/emprendimiento/${emp.idEmprendimiento}`, { headers });
            const avanceData = await avanceRes.json();
            avancesObj[emp.idEmprendimiento] = avanceData.data || { total: 0, completadas: 0, avance: 0 };
          } catch (e) {
            avancesObj[emp.idEmprendimiento] = { total: 0, completadas: 0, avance: 0 };
          }
        }
        setAvances(avancesObj);

        const tareasRes = await fetch(`${API_URL}/segmed/tareas/emprendimiento/${misEmprendimientos[0].idEmprendimiento}`, { headers });
        const tareasData = await tareasRes.json();
        setTareas(tareasData.data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmprendimiento = async (empId) => {
    const emp = emprendimientos.find(e => e.idEmprendimiento === empId);
    setEmprendimientoSeleccionado(emp);
    
    const headers = getAuthHeaders();
    const tareasRes = await fetch(`${API_URL}/segmed/tareas/emprendimiento/${empId}`, { headers });
    const tareasData = await tareasRes.json();
    setTareas(tareasData.data || []);
  };

  const getProgresoColor = (avance) => {
    if (avance >= 70) return '#4CAF50';
    if (avance >= 30) return '#ffc400';
    return '#dc3545';
  };

  const getProgresoTexto = (avance) => {
    if (avance >= 70) return 'Excelente';
    if (avance >= 30) return 'En Proceso';
    return 'Inicial';
  };

  const getEtapaNombre = (id) => {
    const etapas = { 1: 'Idea', 2: 'Prototipo', 3: 'Validación', 4: 'Lanzamiento' };
    return etapas[id] || `Etapa ${id}`;
  };

  const getAvanceActual = () => {
    if (!emprendimientoSeleccionado) return { total: 0, completadas: 0, avance: 0 };
    return avances[emprendimientoSeleccionado.idEmprendimiento] || { total: 0, completadas: 0, avance: 0 };
  };

  const getAvanceCombinado = () => {
    if (emprendimientos.length === 0) return { total: 0, completadas: 0, avance: 0 };
    
    let totalTareas = 0;
    let totalCompletadas = 0;
    
    Object.values(avances).forEach(a => {
      totalTareas += Number(a.total) || 0;
      totalCompletadas += Number(a.completadas) || 0;
    });
    
    const avance = totalTareas > 0 ? Math.round((totalCompletadas / totalTareas) * 100) : 0;
    return { total: totalTareas, completadas: totalCompletadas, avance };
  };

  const avanceActual = getAvanceActual();
  const avanceCombinado = getAvanceCombinado();

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
      <h1 style={{ color: '#0c4a6e', marginBottom: '10px' }}>📊 Mi Progreso</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Seguimiento del avance de tus emprendimientos
      </p>

      {emprendimientos.length === 0 ? (
        <div className="card">
          <div className="card-body text-center" style={{ padding: '50px' }}>
            <p style={{ fontSize: '48px', marginBottom: '15px' }}>📋</p>
            <h4 style={{ color: '#0c4a6e', marginBottom: '15px' }}>Sin Emprendimiento Asignado</h4>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              No tienes un emprendimiento asignado.
            </p>
            <p className="text-muted">Contacta al administrador para que te asigne uno.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Selector de emprendimiento */}
          {emprendimientos.length > 1 && (
            <div className="card mb-4">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <label className="form-label"><strong>Seleccionar Emprendimiento:</strong></label>
                    <select 
                      className="form-select"
                      value={emprendimientoSeleccionado?.idEmprendimiento || ''}
                      onChange={(e) => handleSelectEmprendimiento(parseInt(e.target.value))}
                    >
                      {emprendimientos.map(emp => (
                        <option key={emp.idEmprendimiento} value={emp.idEmprendimiento}>
                          {emp.Nombre} - {getEtapaNombre(emp.EtapaEmprendimiento_idEtapaEmprendimiento)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <div className="text-md-end mt-3 mt-md-0">
                      <span className="badge bg-primary" style={{ fontSize: '14px', padding: '8px 12px' }}>
                        Total: {emprendimientos.length} emprendimientos
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resumen de avances de todos los emprendimientos */}
          <div className="card mb-4" style={{ borderLeft: '4px solid #1a75bc' }}>
            <div className="card-body">
              <h5 style={{ color: '#0c4a6e', marginBottom: '15px' }}>📈 Resumen Combinado</h5>
              <div className="row">
                <div className="col-md-4 text-center">
                  <h2 style={{ color: '#4CAF50', margin: 0 }}>{avanceCombinado.completadas}</h2>
                  <p className="text-muted mb-0">Tareas Completadas</p>
                </div>
                <div className="col-md-4 text-center">
                  <h2 style={{ color: '#ffc400', margin: 0 }}>{avanceCombinado.total - avanceCombinado.completadas}</h2>
                  <p className="text-muted mb-0">Tareas Pendientes</p>
                </div>
                <div className="col-md-4 text-center">
                  <h2 style={{ color: '#1a75bc', margin: 0 }}>{avanceCombinado.total}</h2>
                  <p className="text-muted mb-0">Total Tareas</p>
                </div>
              </div>
              <div className="mt-3" style={{ 
                height: '10px', 
                backgroundColor: '#e0e0e0', 
                borderRadius: '5px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${avanceCombinado.avance}%`, 
                  height: '100%', 
                  backgroundColor: getProgresoColor(avanceCombinado.avance),
                  transition: 'width 0.5s ease'
                }}></div>
              </div>
              <p className="text-center mt-2 mb-0" style={{ color: getProgresoColor(avanceCombinado.avance), fontWeight: 'bold' }}>
                {avanceCombinado.avance}% Avance Combinado
              </p>
            </div>
          </div>

          {/* Avance por emprendimiento */}
          <div className="row mb-4">
            {emprendimientos.map(emp => {
              const av = avances[emp.idEmprendimiento] || { total: 0, completadas: 0, avance: 0 };
              return (
                <div key={emp.idEmprendimiento} className="col-md-6 mb-3">
                  <div 
                    className="card h-100" 
                    style={{ 
                      borderLeft: `4px solid ${getProgresoColor(av.avance)}`,
                      cursor: emprendimientos.length > 1 ? 'pointer' : 'default'
                    }}
                    onClick={() => emprendimientos.length > 1 && handleSelectEmprendimiento(emp.idEmprendimiento)}
                  >
                    <div className="card-body">
                      <h6 style={{ color: '#0c4a6e', marginBottom: '10px' }}>{emp.Nombre}</h6>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted" style={{ fontSize: '13px' }}>
                          {getEtapaNombre(emp.EtapaEmprendimiento_idEtapaEmprendimiento)}
                        </span>
                        <span style={{ 
                          padding: '3px 10px', 
                          borderRadius: '10px', 
                          backgroundColor: getProgresoColor(av.avance),
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {av.avance}%
                        </span>
                      </div>
                      <div style={{ 
                        height: '6px', 
                        backgroundColor: '#e0e0e0', 
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${av.avance}%`, 
                          height: '100%', 
                          backgroundColor: getProgresoColor(av.avance)
                        }}></div>
                      </div>
                      <small className="text-muted">{av.completadas}/{av.total} tareas</small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detalle del emprendimiento seleccionado */}
          {emprendimientoSeleccionado && (
            <>
              {/* Barra de progreso del seleccionado */}
              <div className="card mb-4">
                <div className="card-body">
                  <h5 style={{ color: '#0c4a6e', marginBottom: '15px' }}>
                    📊 Detalle: {emprendimientoSeleccionado.Nombre}
                  </h5>
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: getProgresoColor(avanceActual.avance), fontSize: '48px', margin: 0 }}>
                      {avanceActual.avance}%
                    </h2>
                    <p style={{ color: getProgresoColor(avanceActual.avance), fontWeight: 'bold', margin: '5px 0' }}>
                      {getProgresoTexto(avanceActual.avance)}
                    </p>
                    <p className="text-muted">Avance de este emprendimiento</p>
                  </div>
                  
                  <div style={{ 
                    height: '20px', 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${avanceActual.avance}%`, 
                      height: '100%', 
                      backgroundColor: getProgresoColor(avanceActual.avance),
                      transition: 'width 0.5s ease'
                    }}></div>
                  </div>

                  <div className="row mt-4">
                    <div className="col-md-4 text-center">
                      <h4 style={{ color: '#4CAF50' }}>{avanceActual.completadas}</h4>
                      <p className="text-muted mb-0">Completadas</p>
                    </div>
                    <div className="col-md-4 text-center">
                      <h4 style={{ color: '#ffc400' }}>{avanceActual.total - avanceActual.completadas}</h4>
                      <p className="text-muted mb-0">Pendientes</p>
                    </div>
                    <div className="col-md-4 text-center">
                      <h4 style={{ color: '#1a75bc' }}>{avanceActual.total}</h4>
                      <p className="text-muted mb-0">Total</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del emprendimiento */}
              <div className="card mb-4">
                <div className="card-header" style={{ backgroundColor: '#0c4a6e', color: 'white' }}>
                  <h5 style={{ margin: 0 }}>🚀 Emprendimiento: {emprendimientoSeleccionado.Nombre}</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Tipo:</strong> {emprendimientoSeleccionado.TipoEmprendimiento || 'No especificado'}</p>
                      <p><strong>Sector:</strong> {emprendimientoSeleccionado.SectorProductivo || 'No especificado'}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Etapa Actual:</strong> {getEtapaNombre(emprendimientoSeleccionado.EtapaEmprendimiento_idEtapaEmprendimiento)}</p>
                      <p><strong>Fecha de Inicio:</strong> {emprendimientoSeleccionado.FechaCreacion}</p>
                    </div>
                  </div>
                  <Link 
                    to="/estudiante/emprendimiento/perfil"
                    className="btn btn-sm"
                    style={{ backgroundColor: '#1a75bc', color: 'white' }}
                  >
                    Ver Detalle Completo
                  </Link>
                </div>
              </div>

              {/* Lista de tareas */}
              <div className="card">
                <div className="card-header" style={{ backgroundColor: '#1a75bc', color: 'white' }}>
                  <h5 style={{ margin: 0 }}>📝 Tareas de {emprendimientoSeleccionado.Nombre}</h5>
                </div>
                <div className="card-body">
                  {tareas.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted">No hay tareas asignadas para este emprendimiento</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead style={{ backgroundColor: '#f4f4f4' }}>
                          <tr>
                            <th>Estado</th>
                            <th>Título</th>
                            <th>Fecha Límite</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tareas.map(tarea => (
                            <tr key={tarea.idTareas}>
                              <td>
                                <span style={{ 
                                  padding: '4px 12px', 
                                  borderRadius: '12px', 
                                  backgroundColor: tarea.Estado === 'completada' ? '#4CAF50' : tarea.Estado === 'vencida' ? '#dc3545' : '#ffc400',
                                  color: 'white',
                                  fontSize: '12px',
                                  fontWeight: '500'
                                }}>
                                  {tarea.Estado}
                                </span>
                              </td>
                              <td>{tarea.Titulo}</td>
                              <td>{new Date(tarea.FechaLimite).toLocaleDateString('es-CO')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Progreso;
