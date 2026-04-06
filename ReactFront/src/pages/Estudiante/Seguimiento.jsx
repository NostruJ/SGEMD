import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const Seguimiento = () => {
  const [user, setUser] = useState(null);
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [emprendimientoSeleccionado, setEmprendimientoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await fetch(`${API_URL}/segmed/users/me`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const userData = await userRes.json();
      
      if (userData.success) {
        setUser(userData.data);
        
        const empRes = await fetch(`${API_URL}/segmed/users/${userData.data.idUsuarios}/entrepreneurships`, {
          method: 'GET',
          headers: getAuthHeaders(),
          credentials: 'include'
        });
        const empData = await empRes.json();
        
        if (empData.success && empData.data && empData.data.length > 0) {
          setEmprendimientos(empData.data);
          setEmprendimientoSeleccionado(empData.data[0]);
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const etapas = [
    { id: 1, nombre: 'Idea', descripcion: 'Identificación de la oportunidad de negocio' },
    { id: 2, nombre: 'Prototipo', descripcion: 'Desarrollo del producto o servicio mínimo viable' },
    { id: 3, nombre: 'Lanzamiento', descripcion: 'Puesta en marcha del emprendimiento' },
    { id: 4, nombre: 'Crecimiento', descripcion: 'Escalamiento y consolidación' },
    { id: 5, nombre: 'Consolidación', descripcion: 'Maduración del negocio' }
  ];

  const getEtapaNombre = (id) => {
    return etapas.find(e => e.id === id)?.nombre || 'Idea';
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

  const etapaActual = emprendimientoSeleccionado?.EtapaEmprendimiento_idEtapaEmprendimiento || 1;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h4 className="mb-0 text-primary">Estado de Seguimiento</h4>
        </div>
        <div className="card-body">
          {emprendimientos.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-3">
                No tienes un emprendimiento asignado aún.
              </p>
              <p className="text-muted">
                Contacta al administrador para que te asigne uno.
              </p>
            </div>
          ) : (
            <div>
              {emprendimientos.length > 1 && (
                <div className="mb-4">
                  <label className="form-label"><strong>Seleccionar Emprendimiento:</strong></label>
                  <select 
                    className="form-select"
                    value={emprendimientoSeleccionado?.idEmprendimiento || ''}
                    onChange={(e) => {
                      const selected = emprendimientos.find(emp => emp.idEmprendimiento === parseInt(e.target.value));
                      setEmprendimientoSeleccionado(selected);
                    }}
                  >
                    {emprendimientos.map(emp => (
                      <option key={emp.idEmprendimiento} value={emp.idEmprendimiento}>
                        {emp.Nombre} - {getEtapaNombre(emp.EtapaEmprendimiento_idEtapaEmprendimiento)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {emprendimientoSeleccionado && (
                <div>
                  <div className="alert alert-info mb-4">
                    <strong>Emprendimiento:</strong> {emprendimientoSeleccionado.Nombre}
                  </div>

                  <h5 className="mb-3">Etapa Actual</h5>
                  <div className="card mb-4">
                    <div className="card-body">
                      <h3 className="text-primary">
                        {getEtapaNombre(etapaActual)}
                      </h3>
                      <p className="text-muted">
                        {etapas.find(e => e.id === etapaActual)?.descripcion || ''}
                      </p>
                    </div>
                  </div>

                  <h5 className="mb-3">Historial de Etapas</h5>
                  <div className="row">
                    {etapas.map((etapa, idx) => (
                      <div key={etapa.id} className="col-md-4 mb-3">
                        <div className={`card ${idx + 1 === etapaActual ? 'border-primary' : idx + 1 < etapaActual ? 'border-success' : 'border-secondary'}`}>
                          <div className={`card-body ${idx + 1 === etapaActual ? 'bg-primary-subtle' : idx + 1 < etapaActual ? 'bg-success-subtle' : ''}`}>
                            <h6 className="card-title">
                              {idx + 1 < etapaActual ? '✓ ' : idx + 1 === etapaActual ? '● ' : '○ '}
                              {etapa.nombre}
                            </h6>
                            <small className="text-muted">{etapa.descripcion}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <h5 className="mb-3">Información Adicional</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Tipo:</strong> {emprendimientoSeleccionado.TipoEmprendimiento || 'No especificado'}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Sector:</strong> {emprendimientoSeleccionado.SectorProductivo || 'No especificado'}</p>
                      </div>
                    </div>
                    <p><strong>Fecha de Creación:</strong> {emprendimientoSeleccionado.FechaCreacion}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Seguimiento;
