// src/pages/Admin/Admin.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, RadialBarChart, RadialBar, LineChart, Line } from 'recharts';
import UserMenu from '../../components/UserMenu';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = (includeContentType = true) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const Card = ({ children, title, icon }) => (
  <div className="card" style={{ marginBottom: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
    {title && (
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px', padding: '15px 20px', backgroundColor: '#f8f9fa', borderRadius: '12px 12px 0 0' }}>
        {icon && <span style={{ marginRight: '10px', fontSize: '20px' }}>{icon}</span>}
        <h3 style={{ margin: 0, color: '#0c4a6e', fontSize: '18px', fontWeight: '600' }}>{title}</h3>
      </div>
    )}
    <div style={{ padding: '0 20px 20px' }}>
      {children}
    </div>
  </div>
);

const StatCard = ({ icon, label, value, color, trend }) => (
  <div className="card" style={{ 
    textAlign: 'center', 
    padding: '25px 20px',
    borderRadius: '16px',
    background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
    border: `2px solid ${color}30`,
    boxShadow: `0 8px 20px ${color}20`,
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; }}
  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
  >
    <div style={{ 
      fontSize: '40px', 
      marginBottom: '15px',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
    }}>
      {icon}
    </div>
    <div style={{ 
      fontSize: '36px', 
      fontWeight: '800', 
      color: color,
      textShadow: `0 2px 10px ${color}40`
    }}>
      {value}
    </div>
    <div style={{ color: '#666', fontSize: '14px', fontWeight: '500', marginTop: '8px' }}>
      {label}
    </div>
    {trend && (
      <div style={{ 
        marginTop: '10px', 
        fontSize: '12px', 
        color: trend > 0 ? '#4CAF50' : '#dc3545',
        fontWeight: '600'
      }}>
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs mes anterior
      </div>
    )}
  </div>
);

const Admin = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalEmprendimientos: 0,
    estudiantesActivos: 0,
    maestrosActivos: 0,
    asesoriasRealizadas: 0,
    eventosActivos: 0,
  });
  const [emprendimientosRecientes, setEmprendimientosRecientes] = useState([]);
  const [etapasData, setEtapasData] = useState([]);
  const [sectoresData, setSectoresData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    fetch(`${API_URL}/segmed/users/me`, {
      method: 'GET',
      headers: getAuthHeaders(false),
      credentials: 'include'
    })
      .then(r => r.json())
      .then(j => setUser(j.data || j));

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const headers = getAuthHeaders();
      
      const [usersRes, emprendimientosRes, eventsRes, adviceRes] = await Promise.all([
        fetch(`${API_URL}/segmed/users`, { headers }),
        fetch(`${API_URL}/segmed/entrepreneurship`, { headers }),
        fetch(`${API_URL}/segmed/event`, { headers }),
        fetch(`${API_URL}/segmed/advice`, { headers }),
      ]);

      const usersData = await usersRes.json();
      const emprendimientosData = await emprendimientosRes.json();
      const eventsData = await eventsRes.json();
      const adviceData = await adviceRes.json();

      const usuarios = usersData.data || [];
      const emprendimientos = emprendimientosData.data || [];
      const eventos = eventsData.data || [];
      const asesorias = adviceData.data || [];

      const estudiantes = usuarios.filter(u => u.Roles_idRoles1 === 2);
      const maestros = usuarios.filter(u => u.Roles_idRoles1 === 3);
      const asesoriasCompletadas = asesorias.filter(a => a.confirmacion === 'completada').length;

      setStats({
        totalEmprendimientos: emprendimientos.length,
        estudiantesActivos: estudiantes.filter(u => u.Estado === 1).length,
        maestrosActivos: maestros.filter(u => u.Estado === 1).length,
        asesoriasRealizadas: asesoriasCompletadas,
        eventosActivos: eventos.filter(e => e.Estado === 'activo').length,
      });

      setEmprendimientosRecientes(emprendimientos.slice(0, 5));

      // Datos de etapas con colores más vibrantes
      const etapas = {};
      emprendimientos.forEach(emp => {
        const etapa = emp.EtapaEmprendimiento_idEtapaEmprendimiento || 1;
        etapas[etapa] = (etapas[etapa] || 0) + 1;
      });

      const etapasChart = [
        { name: 'Ideación', value: etapas[1] || 0, color: '#0c4a6e' },
        { name: 'Prototipado', value: etapas[2] || 0, color: '#1a75bc' },
        { name: 'Validación', value: etapas[3] || 0, color: '#ffc400' },
        { name: 'Lanzamiento', value: etapas[4] || 0, color: '#4CAF50' },
      ];
      setEtapasData(etapasChart);

      // Datos de sectores económicos
      const sectores = {};
      emprendimientos.forEach(emp => {
        const sector = emp.SectorProductivo || 'Otros';
        sectores[sector] = (sectores[sector] || 0) + 1;
      });

      const sectoresColores = {
        'Agricultura': '#2ecc71',
        'Comercio': '#3498db',
        'Industria': '#9b59b6',
        'Alimentacion': '#e74c3c',
        'Tecnologia': '#00cec9',
        'Educacion': '#6c5ce7',
        'Salud': '#fd79a8',
        'Construccion': '#fdcb6e',
        'Transporte': '#636e72',
        'Otros': '#b2bec3'
      };

      const sectoresChart = Object.entries(sectores).map(([name, value]) => ({
        name,
        value,
        color: sectoresColores[name] || '#b2bec3'
      }));
      setSectoresData(sectoresChart);

    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEtapaNombre = (id) => {
    const nombres = { 1: 'Ideación', 2: 'Prototipado', 3: 'Validación', 4: 'Lanzamiento' };
    return nombres[id] || 'Sin asignar';
  };

  const getEtapaColor = (id) => {
    const colores = { 1: '#0c4a6e', 2: '#1a75bc', 3: '#ffc400', 4: '#4CAF50' };
    return colores[id] || '#666';
  };

  // Calcular progreso general
  const totalEmprendimientos = stats.totalEmprendimientos;
  const promedioProgreso = totalEmprendimientos > 0 
    ? Math.round((etapasData.filter(e => e.value > 0).length / 4) * 100)
    : 0;

  const progressData = [
    { name: 'Progreso', value: promedioProgreso, fill: '#1a75bc' }
  ];

  if (loading) {
    return (
      <div className="container position-relative">
        <UserMenu user={user} onLogout={() => { window.location.href = '/'; }} />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container position-relative">
      <UserMenu user={user} onLogout={() => { window.location.href = '/'; }} />
      
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ color: '#0c4a6e', marginBottom: '5px', fontSize: '28px', fontWeight: '700' }}>
              📊 Panel de Administración
            </h1>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
              Sistema de Gestión de Emprendimiento Minuto de Dios
            </p>
          </div>
          <div style={{ 
            backgroundColor: '#1a75bc', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            📅 {new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Tarjetas de métricas mejoradas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          <StatCard icon="🎯" label="Total Emprendimientos" value={stats.totalEmprendimientos} color="#0c4a6e" trend={12} />
          <StatCard icon="👨‍🎓" label="Estudiantes Activos" value={stats.estudiantesActivos} color="#1a75bc" trend={5} />
          <StatCard icon="👨‍🏫" label="Docentes Activos" value={stats.maestrosActivos} color="#4CAF50" />
          <StatCard icon="📚" label="Asesorías Realizadas" value={stats.asesoriasRealizadas} color="#ffc400" />
          <StatCard icon="📅" label="Eventos Activos" value={stats.eventosActivos} color="#9b59b6" />
        </div>

        {/* Gráficos principales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          
          {/* Gráfico de Barras por Etapa */}
          <Card title="📈 Distribución por Etapa" icon="">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={etapasData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#666' }} axisLine={{ stroke: '#ddd' }} />
                <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={{ stroke: '#ddd' }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '10px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="value" name="Emprendimientos" radius={[8, 8, 0, 0]} barSize={40}>
                  {etapasData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Gráfico Donut de Sectores */}
          <Card title="🏢 Sectores Productivos" icon="">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sectoresData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sectoresData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '10px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span style={{ fontSize: '11px', color: '#666' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Gráfico Radial de Progreso */}
          <Card title="📊 Índice de Actividad" icon="">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '250px' }}>
              <div style={{ position: 'relative', width: '180px', height: '180px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" barSize={15} data={progressData} startAngle={90} endAngle={-270}>
                    <RadialBar minAngle={15} background={{ fill: '#f0f0f0' }} clockWise dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '42px', fontWeight: '800', color: '#1a75bc' }}>{promedioProgreso}%</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>de avance</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Emprendimientos recientes */}
        <Card title="🚀 Últimos Emprendimientos" icon="">
          {emprendimientosRecientes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p style={{ fontSize: '48px', marginBottom: '15px' }}>📭</p>
              <p>No hay emprendimientos registrados aún</p>
              <Link 
                to="/admin/emprendimientos/crear"
                style={{
                  display: 'inline-block',
                  marginTop: '15px',
                  padding: '12px 24px',
                  backgroundColor: '#1a75bc',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '500'
                }}
              >
                ➕ Crear Primer Emprendimiento
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd', color: '#0c4a6e', fontWeight: '600' }}>Nombre</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd', color: '#0c4a6e', fontWeight: '600' }}>Tipo</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd', color: '#0c4a6e', fontWeight: '600' }}>Sector</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd', color: '#0c4a6e', fontWeight: '600' }}>Etapa</th>
                    <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #ddd', color: '#0c4a6e', fontWeight: '600' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {emprendimientosRecientes.map((emp, index) => (
                    <tr key={emp.idEmprendimiento || index} style={{ borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '15px', fontWeight: '500', color: '#0c4a6e' }}>{emp.Nombre}</td>
                      <td style={{ padding: '15px' }}>{emp.TipoEmprendimiento || 'N/A'}</td>
                      <td style={{ padding: '15px' }}>{emp.SectorProductivo || 'N/A'}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ 
                          padding: '6px 14px', 
                          borderRadius: '20px',
                          backgroundColor: getEtapaColor(emp.EtapaEmprendimiento_idEtapaEmprendimiento) + '20',
                          color: getEtapaColor(emp.EtapaEmprendimiento_idEtapaEmprendimiento),
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {getEtapaNombre(emp.EtapaEmprendimiento_idEtapaEmprendimiento)}
                        </span>
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <Link 
                          to={`/admin/emprendimientos/ver/${emp.idEmprendimiento}`} 
                          style={{ 
                            color: '#1a75bc', 
                            textDecoration: 'none', 
                            fontWeight: '600',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: '1px solid #1a75bc',
                            transition: 'all 0.2s'
                          }}
                        >
                          Ver Detalle →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Accesos rápidos */}
        <Card title="⚡ Accesos Rápidos" icon="">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
            <Link to="/admin/usuarios" style={quickLinkStyle}>
              👥 Gestionar Usuarios
            </Link>
            <Link to="/admin/docentes/gestion" style={quickLinkStyle}>
              👨‍🏫 Asignar Docentes
            </Link>
            <Link to="/admin/emprendimientos/crear" style={quickLinkStyle}>
              🚀 Nuevo Emprendimiento
            </Link>
            <Link to="/admin/eventos" style={quickLinkStyle}>
              📅 Gestionar Eventos
            </Link>
            <Link to="/admin/gestionar/estudiantes" style={quickLinkStyle}>
              👨‍🎓 Ver Estudiantes
            </Link>
            <Link to="/admin/perfil" style={quickLinkStyle}>
              ⚙️ Mi Perfil
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

const quickLinkStyle = {
  display: 'block',
  padding: '18px 20px',
  backgroundColor: '#1a75bc',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '12px',
  textAlign: 'center',
  fontWeight: '500',
  transition: 'all 0.3s',
  boxShadow: '0 4px 10px rgba(26, 117, 188, 0.3)',
};

export default Admin;