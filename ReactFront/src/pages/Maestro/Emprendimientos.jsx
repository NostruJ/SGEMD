import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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

const EmpPerfil = () => {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEmp, setSelectedEmp] = useState(null);

  useEffect(() => {
    fetchEmprendimientos();
  }, []);

  const fetchEmprendimientos = async () => {
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
      setError('Error al cargar emprendimientos');
    } finally {
      setLoading(false);
    }
  };

  const etapas = [
    { id: 1, nombre: 'Idea' },
    { id: 2, nombre: 'Prototipo' },
    { id: 3, nombre: 'Lanzamiento' },
    { id: 4, nombre: 'Crecimiento' },
    { id: 5, nombre: 'Consolidación' }
  ];

  const getEtapaNombre = (id) => etapas.find(e => e.id === id)?.nombre || 'Idea';

  const etapasData = [
    { name: 'Idea', value: emprendimientos.filter(e => e.EtapaEmprendimiento_idEtapaEmprendimiento === 1).length, color: '#0c4a6e' },
    { name: 'Prototipo', value: emprendimientos.filter(e => e.EtapaEmprendimiento_idEtapaEmprendimiento === 2).length, color: '#1a75bc' },
    { name: 'Lanzamiento', value: emprendimientos.filter(e => e.EtapaEmprendimiento_idEtapaEmprendimiento === 3).length, color: '#4CAF50' },
    { name: 'Crecimiento', value: emprendimientos.filter(e => e.EtapaEmprendimiento_idEtapaEmprendimiento === 4).length, color: '#ffc400' },
    { name: 'Consolidación', value: emprendimientos.filter(e => e.EtapaEmprendimiento_idEtapaEmprendimiento === 5).length, color: '#dc3545' }
  ];

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
    <div style={{ padding: '20px' }}>
      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center" style={{ padding: '15px 20px' }}>
          <h4 className="mb-0 text-primary" style={{ color: '#0c4a6e' }}>🎯 Mis Emprendimientos</h4>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <div className="alert alert-info" style={{ borderRadius: '12px' }}>
            <strong>📊 Total de Emprendimientos:</strong> {emprendimientos.length}
          </div>

          {emprendimientos.length > 0 && (
            <Card title="📈 Distribución por Etapa" icon="">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={etapasData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#666' }} axisLine={{ stroke: '#ddd' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={{ stroke: '#ddd' }} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
                  <Bar dataKey="value" name="Emprendimientos" radius={[8, 8, 0, 0]} barSize={40}>
                    {etapasData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
          
          {emprendimientos.length === 0 ? (
            <div className="text-center py-5">
              <p style={{ fontSize: '48px', marginBottom: '15px' }}>📭</p>
              <p className="text-muted">No hay emprendimientos registrados</p>
            </div>
          ) : (
            <div className="row">
              {emprendimientos.map((emp, idx) => (
                <div key={idx} className="col-md-6 mb-4">
                  <div className="card h-100" style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <div className="card-header bg-light" style={{ borderRadius: '12px 12px 0 0' }}>
                      <h5 className="mb-0" style={{ color: '#0c4a6e' }}>{emp.Nombre}</h5>
                    </div>
                    <div className="card-body">
                      <p><strong>Tipo:</strong> {emp.TipoEmprendimiento || 'No especificado'}</p>
                      <p><strong>Sector:</strong> {emp.SectorProductivo || 'No especificado'}</p>
                      <p><strong>Etapa:</strong> <span className="badge bg-primary">{getEtapaNombre(emp.EtapaEmprendimiento_idEtapaEmprendimiento)}</span></p>
                      <p><strong>Descripción:</strong> {emp.Descripcion || 'Sin descripción'}</p>
                    </div>
                    <div className="card-footer" style={{ borderRadius: '0 0 12px 12px' }}>
                      <Link to={`/maestro/emprendimientos/seguimiento?id=${emp.idEmprendimiento}`} className="btn btn-sm" style={{ backgroundColor: '#1a75bc', color: 'white' }}>
                        Ver Seguimiento
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmpPerfil;