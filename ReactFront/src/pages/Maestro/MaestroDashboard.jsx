// src/pages/Maestro/MaestroDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

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

const MaestroDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    emprendimientosAsignados: 0,
    asesoriasCompletadas: 0,
    asesoriasPendientes: 0,
    estudiantesAtendidos: 0,
  });
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [asesoriasProximas, setAsesoriasProximas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchDashboardData();
  }, []);

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
      
      const [asesoriasRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/segmed/advice`, { headers }),
        fetch(`${API_URL}/segmed/users`, { headers }),
      ]);

      const asesoriasData = await asesoriasRes.json();
      const usersData = await usersRes.json();

      const asesorias = asesoriasData.data || [];
      const usuarios = usersData.data || [];

      const estudianteIds = [...new Set(asesorias.map(a => a.Usuarios_idUsuarios).filter(Boolean))];
      const uniqueEstudiantes = new Set(estudianteIds);

      const pendientes = asesorias.filter(a => a.confirmacion === 'pendiente');
      const completadas = asesorias.filter(a => a.confirmacion === 'completada');

      setStats({
        emprendimientosAsignados: uniqueEstudiantes.size,
        asesoriasCompletadas: completadas.length,
        asesoriasPendientes: pendientes.length,
        estudiantesAtendidos: uniqueEstudiantes.size,
      });

      setEmprendimientos(asesorias.slice(0, 5).map(a => ({
        id: a.idAsesorias,
        nombre: a.Nombre_de_asesoria || 'Asesoría sin nombre',
        estudiante: usuarios.find(u => u.idUsuarios === a.Usuarios_idUsuarios)?.Nombre || 'Estudiante',
        fecha: a.Fecha_asesoria,
        estado: a.confirmacion || 'pendiente',
      })));

      const proximas = pendientes
        .filter(a => new Date(a.Fecha_asesoria) > new Date())
        .slice(0, 3);
      setAsesoriasProximas(proximas);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getEstadoBadge = (estado) => {
    const colors = {
      pendiente: { bg: '#fff3cd', color: '#856404' },
      completada: { bg: '#d4edda', color: '#155724' },
      cancelada: { bg: '#f8d7da', color: '#721c24' },
    };
    const style = colors[estado] || colors.pendiente;
    return (
      <span style={{ padding: '4px 12px', borderRadius: '12px', backgroundColor: style.bg, color: style.color, fontSize: '12px' }}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
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
      <h1 style={{ color: '#0c4a6e', marginBottom: '10px' }}>
        👨‍🏫 Panel del Docente - SGEMD
      </h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Bienvenido, {user?.Nombre || 'Docente'}. Aquí está el resumen de tus actividades.
      </p>

      {/* Tarjetas de métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <StatCard icon="🎯" label="Emprendimientos a Cargo" value={stats.emprendimientosAsignados} color="#0057a4" />
        <StatCard icon="✅" label="Asesorías Completadas" value={stats.asesoriasCompletadas} color="#4CAF50" />
        <StatCard icon="⏳" label="Asesorías Pendientes" value={stats.asesoriasPendientes} color="#ffc400" />
        <StatCard icon="👥" label="Estudiantes Atendidos" value={stats.estudiantesAtendidos} color="#1a75bc" />
      </div>

      {/* Contenido principal */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Tabla de asesorías */}
        <Card title="Emprendimientos y Asesorías" icon="📋">
          {emprendimientos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p style={{ fontSize: '48px', marginBottom: '10px' }}>📭</p>
              <p>No hay asesorías registradas aún.</p>
              <Link 
                to="/maestro/asesorias/crear" 
                style={{ display: 'inline-block', marginTop: '15px', padding: '10px 20px', backgroundColor: '#1a75bc', color: 'white', textDecoration: 'none', borderRadius: '5px' }}
              >
                + Crear Primera Asesoría
              </Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f4f4f4' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Asesoría</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Estudiante</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Fecha</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Estado</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {emprendimientos.map((item, index) => (
                  <tr key={item.id || index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{item.nombre}</td>
                    <td style={{ padding: '12px' }}>{item.estudiante}</td>
                    <td style={{ padding: '12px' }}>{formatDate(item.fecha)}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{getEstadoBadge(item.estado)}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <Link 
                        to="/maestro/asesorias" 
                        style={{ color: '#1a75bc', textDecoration: 'none', fontWeight: 'bold' }}
                      >
                        Ver →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {/* Próximas asesorías */}
        <Card title="Próximas Asesorías" icon="📅">
          {asesoriasProximas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
              <p style={{ fontSize: '32px', marginBottom: '10px' }}>📅</p>
              <p>No hay asesorías programadas</p>
            </div>
          ) : (
            <div>
              {asesoriasProximas.map((asesoria, index) => (
                <div key={asesoria.idAsesorias || index} style={{ 
                  padding: '15px', 
                  border: '1px solid #eee', 
                  borderRadius: '8px', 
                  marginBottom: '10px',
                  backgroundColor: '#fafafa'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#0c4a6e', marginBottom: '5px' }}>
                    {asesoria.Nombre_de_asesoria}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    📅 {formatDate(asesoria.Fecha_asesoria)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Accesos rápidos */}
      <Card title="Accesos Rápidos" icon="⚡" style={{ marginTop: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
          <Link to="/maestro/asesorias/crear" style={quickLinkStyle}>
            ➕ Crear Asesoría
          </Link>
          <Link to="/maestro/asesorias" style={quickLinkStyle}>
            📋 Mis Asesorías
          </Link>
          <Link to="/maestro/emprendimientos/seguimiento" style={quickLinkStyle}>
            📈 Seguimiento
          </Link>
          <Link to="/maestro/perfil" style={quickLinkStyle}>
            ⚙️ Mi Perfil
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

export default MaestroDashboard;
