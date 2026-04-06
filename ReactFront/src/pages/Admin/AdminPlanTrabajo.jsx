import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const Card = ({ children, title, icon }) => (
  <div className="card" style={{ marginBottom: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
    {title && (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '15px 20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '12px 12px 0 0',
        borderBottom: '1px solid #eee'
      }}>
        {icon && <span style={{ marginRight: '10px', fontSize: '20px' }}>{icon}</span>}
        <h3 style={{ margin: 0, color: '#0c4a6e', fontSize: '18px', fontWeight: '600' }}>{title}</h3>
      </div>
    )}
    <div style={{ padding: '20px' }}>
      {children}
    </div>
  </div>
);

const AdminPlanTrabajo = () => {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/segmed/entrepreneurship`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      
      if (data.success) {
        setEmprendimientos(data.data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const etapaColors = {
    1: '#0c4a6e',
    2: '#1a75bc',
    3: '#ffc400',
    4: '#4CAF50'
  };

  const etapaNames = {
    1: 'Ideación',
    2: 'Prototipado',
    3: 'Validación',
    4: 'Lanzamiento'
  };

  const etapasData = [
    { name: 'Ideación', value: emprendimientos.filter(e => e.EtapaEmprendimiento_idEtapaEmprendimiento === 1).length, color: '#0c4a6e' },
    { name: 'Prototipado', value: emprendimientos.filter(e => e.EtapaEmprendimiento_idEtapaEmprendimiento === 2).length, color: '#1a75bc' },
    { name: 'Validación', value: emprendimientos.filter(e => e.EtapaEmprendimiento_idEtapaEmprendimiento === 3).length, color: '#ffc400' },
    { name: 'Lanzamiento', value: emprendimientos.filter(e => e.EtapaEmprendimiento_idEtapaEmprimiento === 4).length, color: '#4CAF50' }
  ];

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

  const sectoresData = Object.entries(
    emprendimientos.reduce((acc, emp) => {
      const sector = emp.SectorProductivo || 'Otros';
      acc[sector] = (acc[sector] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({
    name,
    value,
    color: sectoresColores[name] || '#b2bec3'
  }));

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
    <div className="container mt-4" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#0c4a6e', margin: 0 }}>📋 Plan de Trabajo</h2>
        <Link 
          to="/admin/emprendimientos/crear" 
          className="btn"
          style={{ backgroundColor: '#1a75bc', color: 'white' }}
        >
          ➕ Nuevo Emprendimiento
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="alert alert-info" style={{ borderRadius: '12px' }}>
        <strong>📊 Total de Emprendimientos:</strong> {emprendimientos.length}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <Card title="📈 Distribución por Etapa" icon="">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={etapasData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#666' }} axisLine={{ stroke: '#ddd' }} />
              <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={{ stroke: '#ddd' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
              />
              <Bar dataKey="value" name="Emprendimientos" radius={[8, 8, 0, 0]} barSize={50}>
                {etapasData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="🏢 Distribución por Sector" icon="">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={sectoresData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {sectoresData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span style={{ fontSize: '11px', color: '#666' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="🚀 Lista de Emprendimientos" icon="">
        {emprendimientos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '48px', marginBottom: '15px' }}>📭</p>
            <p className="text-muted">No hay emprendimientos registrados</p>
            <Link 
              to="/admin/emprendimientos/crear"
              className="btn"
              style={{ backgroundColor: '#1a75bc', color: 'white', marginTop: '10px' }}
            >
              Crear Primer Emprendimiento
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th style={{ fontWeight: '600', color: '#0c4a6e' }}>Nombre</th>
                  <th style={{ fontWeight: '600', color: '#0c4a6e' }}>Tipo</th>
                  <th style={{ fontWeight: '600', color: '#0c4a6e' }}>Sector</th>
                  <th style={{ fontWeight: '600', color: '#0c4a6e' }}>Estudiante</th>
                  <th style={{ fontWeight: '600', color: '#0c4a6e' }}>Etapa</th>
                  <th style={{ fontWeight: '600', color: '#0c4a6e' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {emprendimientos.map((emp, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ fontWeight: '500', color: '#0c4a6e' }}>{emp.Nombre}</td>
                    <td>{emp.TipoEmprendimiento || 'N/A'}</td>
                    <td>{emp.SectorProductivo || 'N/A'}</td>
                    <td>{emp.Usuarios_idUsuarios || 'N/A'}</td>
                    <td>
                      <span 
                        className="badge"
                        style={{ 
                          backgroundColor: (etapaColors[emp.EtapaEmprendimiento_idEtapaEmprendimiento] || '#666') + '20',
                          color: etapaColors[emp.EtapaEmprendimiento_idEtapaEmprendimiento] || '#666',
                          padding: '6px 12px',
                          borderRadius: '20px'
                        }}
                      >
                        {etapaNames[emp.EtapaEmprendimiento_idEtapaEmprendimiento] || 'Etapa ' + (emp.EtapaEmprendimiento_idEtapaEmprendimiento || 1)}
                      </span>
                    </td>
                    <td>
                      <Link 
                        to={`/admin/emprendimientos/ver/${emp.idEmprendimiento}`}
                        className="btn btn-sm"
                        style={{ backgroundColor: '#1a75bc', color: 'white' }}
                      >
                        Ver Detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminPlanTrabajo;