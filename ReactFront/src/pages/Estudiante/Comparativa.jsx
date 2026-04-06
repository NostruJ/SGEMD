import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const Comparativa = () => {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const dataEstadisticas = [
    { name: 'Idea', value: emprendimientos.filter(e => e.EtapaEmprendimiento_idEtapaEmprendimiento === 1).length, color: '#6c757d' },
    { name: 'Prototipo', value: emprendimientos.filter(e => e.EtapaEmprendimiento_idEtapaEmprendimiento === 2).length, color: '#0d6efd' },
    { name: 'Lanzamiento', value: emprendimientos.filter(e => e.EtapaEmprendimiento_idEtapaEmprendimiento === 3).length, color: '#198754' },
    { name: 'Crecimiento', value: emprendimientos.filter(e => e.EtapaEmprendimiento_idEtapaEmprendimiento === 4).length, color: '#ffc107' },
    { name: 'Consolidación', value: emprendimientos.filter(e => e.EtapaEmprendimiento_idEtapaEmprendimiento === 5).length, color: '#dc3545' }
  ];

  const dataSectores = [
    { name: 'Agricultura', value: emprendimientos.filter(e => e.SectorProductivo === 'Agricultura').length },
    { name: 'Comercio', value: emprendimientos.filter(e => e.SectorProductivo === 'Comercio').length },
    { name: 'Industria', value: emprendimientos.filter(e => e.SectorProductivo === 'Industria').length },
    { name: 'Tecnología', value: emprendimientos.filter(e => e.SectorProductivo === 'Tecnologia').length },
    { name: 'Servicios', value: emprendimientos.filter(e => e.SectorProductivo === 'Otros').length }
  ];

  const etapaNames = {
    1: 'Idea',
    2: 'Prototipo',
    3: 'Lanzamiento',
    4: 'Crecimiento',
    5: 'Consolidación'
  };

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
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h4 className="mb-0 text-primary">Análisis Comparativo</h4>
        </div>
        <div className="card-body">
          <div className="alert alert-info mb-4">
            <strong>Total de Emprendimientos:</strong> {emprendimientos.length}
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <h5 className="mb-3">Emprendimientos por Etapa</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataEstadisticas}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value">
                    {dataEstadisticas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="col-md-6">
              <h5 className="mb-3">Emprendimientos por Sector</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataSectores}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0d6efd" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <h5 className="mb-3">Lista de Emprendimientos</h5>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Sector</th>
                  <th>Etapa</th>
                </tr>
              </thead>
              <tbody>
                {emprendimientos.length > 0 ? (
                  emprendimientos.map((emp, idx) => (
                    <tr key={idx}>
                      <td>{emp.Nombre}</td>
                      <td>{emp.TipoEmprendimiento || 'N/A'}</td>
                      <td>{emp.SectorProductivo || 'N/A'}</td>
                      <td>
                        <span className="badge bg-primary">
                          {etapaNames[emp.EtapaEmprendimiento_idEtapaEmprendimiento] || 'Idea'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No hay emprendimientos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comparativa;
