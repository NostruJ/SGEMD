// src/pages/Estudiante/DashboardContent.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const Card = ({ children, title, icon }) => (
  <div className="card" style={{ marginBottom: '20px' }}>
    {title && (
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        {icon && <span style={{ marginRight: '10px', fontSize: '20px' }}>{icon}</span>}
        <h3 style={{ margin: 0, color: '#0c4a6e' }}>{title}</h3>
      </div>
    )}
    {children}
  </div>
);

const StatCard = ({ icon, label, value, color }) => (
  <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
    <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color: color || '#1a75bc' }}>{value}</div>
    <div style={{ color: '#666', fontSize: '14px' }}>{label}</div>
  </div>
);

const DashboardContent = () => {
  const [user, setUser] = useState(null);
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [asesorias, setAsesorias] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [avance, setAvance] = useState({ total: 0, completadas: 0, avance: 0 });
  const [tareasVencidas, setTareasVencidas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user?.idUsuarios) {
      fetchDashboardData();
    }
  }, [user?.idUsuarios]);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${API_URL}/segmed/users/me`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      setUser(data.data || data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const headers = getAuthHeaders();
      const userId = user?.idUsuarios;

      const [empRes, asesoriasRes, eventsRes, tareasRes, avanceRes] = await Promise.all([
        userId ? fetch(`${API_URL}/segmed/entrepreneurship`, { headers }) : Promise.resolve({ json: () => ({ data: [] }) }),
        fetch(`${API_URL}/segmed/advice`, { headers }),
        fetch(`${API_URL}/segmed/event`, { headers }),
        fetch(`${API_URL}/segmed/tareas/mis-tareas`, { headers }),
        fetch(`${API_URL}/segmed/tareas/avance/usuario`, { headers })
      ]);

      const empData = await empRes.json();
      const asesoriasData = await asesoriasRes.json();
      const eventsData = await eventsRes.json();
      const tareasData = await tareasRes.json();
      const avanceData = await avanceRes.json();

      const emprendimientos = empData.data || [];
      const misEmprendimientos = emprendimientos.filter(e => e.Usuarios_idUsuarios === userId);
      setEmprendimientos(misEmprendimientos);

      const todasAsesorias = asesoriasData.data || [];
      const misAsesorias = todasAsesorias.filter(a => a.Usuarios_idUsuarios === userId);
      setAsesorias(misAsesorias);

      const todosEventos = eventsData.data || [];
      const eventosActivos = todosEventos.filter(e => e.Estado === 'activo');
      setEventos(eventosActivos);

      setTareas(tareasData.data || []);
      setAvance({
        total: Number(avanceData.data?.total) || 0,
        completadas: Number(avanceData.data?.completadas) || 0,
        avance: Number(avanceData.data?.avance) || 0
      });
      setTareasVencidas(tareasData.tareasVencidas || []);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.idUsuarios) {
      fetchDashboardData();
    }
  }, [user?.idUsuarios]);

  const getEtapaNombre = (id) => {
    const nombres = { 1: 'Ideación', 2: 'Prototipado', 3: 'Validación', 4: 'Lanzamiento' };
    return nombres[id] || 'Sin asignar';
  };

  const getEtapaColor = (id) => {
    const colores = { 1: '#0057a4', 2: '#1a75bc', 3: '#ffc400', 4: '#4CAF50' };
    return colores[id] || '#666';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getProgreso = (emp) => {
    const etapa = emp?.EtapaEmprendimiento_idEtapaEmprendimiento || 1;
    return etapa * 25;
  };

  const getEmpActual = () => {
    if (emprendimientos.length === 0) return null;
    return emprendimientos[0];
  };

  const etapasData = (emp) => [
    { name: 'Ideación', value: getProgreso(emp) >= 25 ? 1 : 0, color: '#0057a4' },
    { name: 'Prototipado', value: getProgreso(emp) >= 50 ? 1 : 0, color: '#1a75bc' },
    { name: 'Validación', value: getProgreso(emp) >= 75 ? 1 : 0, color: '#ffc400' },
    { name: 'Lanzamiento', value: getProgreso(emp) >= 100 ? 1 : 0, color: '#4CAF50' },
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
      <h1 style={{ color: '#0c4a6e', marginBottom: '10px' }}>
        🎓 Mi Panel - SGEMD
      </h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Bienvenido, {user?.Nombre || 'Estudiante'}. Aquí puedes seguir el avance de tu emprendimiento.
      </p>

      {/* Mi Emprendimiento(s) */}
      {emprendimientos.length > 0 ? (
        <Card title={emprendimientos.length === 1 ? "Mi Emprendimiento" : "Mis Emprendimientos"} icon="🚀">
          {emprendimientos.length > 1 && (
            <div className="mb-3">
              <span className="badge bg-primary" style={{ fontSize: '14px', padding: '8px 12px' }}>
                Tienes {emprendimientos.length} emprendimientos asignados
              </span>
            </div>
          )}
          {emprendimientos.slice(0, 1).map(emp => (
          <div key={emp.idEmprendimiento} style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: getEtapaColor(emp.EtapaEmprendimiento_idEtapaEmprendimiento),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold'
            }}>
              {getProgreso(emp)}%
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: '0 0 10px 0', color: '#003366' }}>{emp.Nombre}</h2>
              <p style={{ margin: 0, color: '#666' }}>{emp.Descripcion || 'Sin descripción aún'}</p>
              <div style={{ marginTop: '10px' }}>
                <span style={{ 
                  padding: '5px 15px', 
                  borderRadius: '15px', 
                  backgroundColor: getEtapaColor(emp.EtapaEmprendimiento_idEtapaEmprendimiento),
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {getEtapaNombre(emp.EtapaEmprendimiento_idEtapaEmprendimiento)}
                </span>
              </div>
            </div>
          </div>
          ))}
          {emprendimientos.length > 1 && (
            <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
              <h5 style={{ color: '#0c4a6e', marginBottom: '15px' }}>Todos mis Emprendimientos:</h5>
              <div className="row">
                {emprendimientos.map(emp => (
                  <div key={emp.idEmprendimiento} className="col-md-6 mb-3">
                    <div className="card h-100" style={{ borderLeft: `4px solid ${getEtapaColor(emp.EtapaEmprendimiento_idEtapaEmprendimiento)}` }}>
                      <div className="card-body">
                        <h6 style={{ color: '#0c4a6e', marginBottom: '10px' }}>{emp.Nombre}</h6>
                        <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                          {emp.Descripcion?.substring(0, 60) || 'Sin descripción'}...
                        </p>
                        <span style={{ 
                          padding: '3px 10px', 
                          borderRadius: '10px', 
                          backgroundColor: getEtapaColor(emp.EtapaEmprendimiento_idEtapaEmprendimiento),
                          color: 'white',
                          fontSize: '12px'
                        }}>
                          {getEtapaNombre(emp.EtapaEmprendimiento_idEtapaEmprendimiento)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                to="/estudiante/emprendimiento/perfil" 
                style={{ 
                  display: 'inline-block', 
                  marginTop: '10px',
                  color: '#1a75bc', 
                  textDecoration: 'none', 
                  fontWeight: 'bold'
                }}
              >
                Ver detalles de todos →
              </Link>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {etapasData(emprendimientos[0]).map((etapa, index) => (
              <div key={etapa.name} style={{ 
                padding: '10px', 
                textAlign: 'center',
                backgroundColor: etapa.value > 0 ? '#e8f5e9' : '#f5f5f5',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '20px' }}>{etapa.value > 0 ? '✅' : '⬜'}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{etapa.name}</div>
              </div>
            ))}
          </div>
          ))}
        </Card>
      ) : (
        <Card title="Mi Emprendimiento" icon="🚀">
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p style={{ fontSize: '48px', marginBottom: '15px' }}>📝</p>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>Aún no has registrado tu emprendimiento</p>
            <Link 
              to="/estudiante/emprendimiento/perfil" 
              style={{ 
                display: 'inline-block', 
                padding: '12px 24px', 
                backgroundColor: '#1a75bc', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '5px',
                fontWeight: 'bold'
              }}
            >
              ➕ Registrar Mi Emprendimiento
            </Link>
          </div>
        </Card>
      )}

      {/* Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <StatCard icon="✅" label="Tareas Completadas" value={avance.completadas} color="#4CAF50" />
        <StatCard icon="📋" label="Tareas Totales" value={avance.total} color="#1a75bc" />
        <StatCard icon="📅" label="Eventos Disponibles" value={eventos.length} color="#1a75bc" />
        <StatCard icon="📈" label="Progreso" value={`${avance.avance}%`} color={avance.avance >= 70 ? '#4CAF50' : avance.avance >= 30 ? '#ffc400' : '#dc3545'} />
      </div>

      {/* Alerta de tareas vencidas */}
      {tareasVencidas.length > 0 && (
        <div className="card mb-4" style={{ borderLeft: '4px solid #dc3545' }}>
          <div className="card-header" style={{ backgroundColor: '#dc3545', color: 'white' }}>
            <h5 style={{ margin: 0 }}>⚠️ Tienes {tareasVencidas.length} tarea(s) vencida(s)</h5>
          </div>
          <div className="card-body">
            {tareasVencidas.map(tarea => (
              <div key={tarea.idTareas} className="mb-2 pb-2" style={{ borderBottom: '1px solid #eee' }}>
                <strong>{tarea.Titulo}</strong>
                <p className="mb-0 text-danger" style={{ fontSize: '12px' }}>
                  Venció el {new Date(tarea.FechaLimite).toLocaleDateString('es-CO')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Línea de tiempo */}
        <Card title="Línea de Tiempo" icon="📜">
          {asesorias.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
              <p style={{ fontSize: '32px', marginBottom: '10px' }}>📋</p>
              <p>No hay asesorías registradas aún</p>
            </div>
          ) : (
            <div style={{ position: 'relative', paddingLeft: '30px' }}>
              <div style={{ 
                position: 'absolute', 
                left: '10px', 
                top: 0, 
                bottom: 0, 
                width: '2px', 
                backgroundColor: '#e0e0e0' 
              }}></div>
              {asesorias.slice(0, 5).map((asesoria, index) => (
                <div key={asesoria.idAsesorias || index} style={{ 
                  position: 'relative', 
                  marginBottom: '20px',
                  padding: '15px',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${asesoria.confirmacion === 'completada' ? '#4CAF50' : '#ffc400'}`
                }}>
                  <div style={{ 
                    position: 'absolute', 
                    left: '-27px', 
                    top: '15px',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: '#1a75bc',
                    border: '2px solid white'
                  }}></div>
                  <div style={{ fontWeight: 'bold', color: '#0c4a6e' }}>
                    {asesoria.Nombre_de_asesoria}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    📅 {formatDate(asesoria.Fecha_asesoria)}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                    {asesoria.Descripcion?.substring(0, 80)}...
                  </div>
                </div>
              ))}
              <Link to="/estudiante/progreso" style={{ color: '#1a75bc', textDecoration: 'none', fontWeight: 'bold' }}>
                Ver historial completo →
              </Link>
            </div>
          )}
        </Card>

        {/* Próximos eventos */}
        <Card title="Próximos Eventos" icon="🎉">
          {eventos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
              <p style={{ fontSize: '32px', marginBottom: '10px' }}>📅</p>
              <p>No hay eventos disponibles</p>
            </div>
          ) : (
            <div>
              {eventos.slice(0, 3).map((evento, index) => (
                <div key={evento.idEventos || index} style={{ 
                  padding: '15px', 
                  border: '1px solid #eee', 
                  borderRadius: '8px', 
                  marginBottom: '10px',
                  backgroundColor: '#fafafa'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#0c4a6e', marginBottom: '5px' }}>
                    {evento.Nombre_evento}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    📅 {formatDate(evento.Fecha_inicio)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                    {evento.Descripcion_evento?.substring(0, 60)}...
                  </div>
                </div>
              ))}
              <Link to="/estudiante/eventos" style={{ color: '#1a75bc', textDecoration: 'none', fontWeight: 'bold' }}>
                Ver todos los eventos →
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Accesos rápidos */}
      <Card title="Accesos Rápidos" icon="⚡">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
          <Link to="/estudiante/perfil" style={quickLinkStyle}>
            ⚙️ Mi Perfil
          </Link>
          <Link to="/estudiante/emprendimiento/perfil" style={quickLinkStyle}>
            📝 Mi Proyecto
          </Link>
          <Link to="/estudiante/progreso" style={quickLinkStyle}>
            📊 Ver Progreso
          </Link>
          <Link to="/estudiante/eventos" style={quickLinkStyle}>
            🎉 Ver Eventos
          </Link>
        </div>
      </Card>
    </div>
  );
};

const quickLinkStyle = {
  display: 'block',
  padding: '15px 20px',
  backgroundColor: '#1a75bc',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '8px',
  textAlign: 'center',
  fontWeight: '500',
  transition: 'background-color 0.2s',
};

export default DashboardContent;
