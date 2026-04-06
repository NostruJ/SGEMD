import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const PlanTrabajo = () => {
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

  const getEtapaNombre = (id) => {
    const etapas = { 1: 'Idea', 2: 'Prototipo', 3: 'Validación', 4: 'Lanzamiento' };
    return etapas[id] || `Etapa ${id}`;
  };

  const actividadesEjemplo = [
    { fase: 'Fase 1: Ideación', actividades: [
      'Identificación de problema/oportunidad',
      'Investigación de mercado',
      'Definición del modelo de negocio',
      'Desarrollo de propuesta de valor'
    ]},
    { fase: 'Fase 2: Diseño', actividades: [
      'Prototipado del producto/servicio',
      'Diseño de procesos',
      'Planificación de recursos',
      'Elaboración del plan financiero'
    ]},
    { fase: 'Fase 3: Lanzamiento', actividades: [
      'Ejecución del plan de mercadeo',
      'Lanzamiento del producto/servicio',
      'Captación de primeros clientes',
      'Seguimiento de métricas iniciales'
    ]},
    { fase: 'Fase 4: Crecimiento', actividades: [
      'Análisis de feedback',
      'Mejora continua',
      'Escalamiento del negocio',
      'Búsqueda de financiamiento'
    ]}
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
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h4 className="mb-0 text-primary">Plan de Trabajo</h4>
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
                  
                  <div className="row">
                    {actividadesEjemplo.map((fase, idx) => (
                      <div key={idx} className="col-md-6 mb-4">
                        <div className="card h-100">
                          <div className="card-header bg-light">
                            <h6 className="mb-0">{fase.fase}</h6>
                          </div>
                          <div className="card-body">
                            <ul className="list-group list-group-flush">
                              {fase.actividades.map((actividad, aIdx) => (
                                <li key={aIdx} className="list-group-item d-flex align-items-center">
                                  <input className="form-check-input me-2" type="checkbox" />
                                  {actividad}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default PlanTrabajo;
