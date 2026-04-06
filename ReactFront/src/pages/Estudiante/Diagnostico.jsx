import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const DiagnosticoEstudiante = () => {
  const [diagnostico, setDiagnostico] = useState(null);
  const [emprendimiento, setEmprendimiento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders();
      
      const [userRes, empRes, diagRes] = await Promise.all([
        fetch(`${API_URL}/segmed/users/me`, { headers, credentials: 'include' }),
        fetch(`${API_URL}/segmed/entrepreneurship`, { headers }),
        fetch(`${API_URL}/segmed/diagnosis/me`, { headers })
      ]);

      const userData = await userRes.json();
      const empData = await empRes.json();
      const diagData = await diagRes.json();

      const emprendimientos = empData.data || [];
      const userId = userData.data?.idusuarios || userData.data?.idUsuarios;
      const miEmp = emprendimientos.find(e => e.Usuarios_idUsuarios === userId);
      setEmprendimiento(miEmp);

      const diagnosticos = diagData.data || [];
      if (diagnosticos.length > 0) {
        setDiagnostico(diagnosticos[0]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
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

  if (!emprendimiento) {
    return (
      <div style={{ padding: '20px' }}>
        <div className="card">
          <div className="card-body text-center" style={{ padding: '50px' }}>
            <p style={{ fontSize: '48px', marginBottom: '15px' }}>📋</p>
            <h4 style={{ color: '#0c4a6e', marginBottom: '15px' }}>Diagnóstico del Emprendimiento</h4>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              No tienes un emprendimiento asignado.
            </p>
            <p className="text-muted">Contacta al administrador para que te asigne uno.</p>
          </div>
        </div>
      </div>
    );
  }

  const camposDiagnostico = [
    { name: 'AreaEstrategia', label: 'Área de Estrategia' },
    { name: 'Diferencial', label: 'Factor Diferencial' },
    { name: 'Planeacion', label: 'Planificación' },
    { name: 'MercadoObjetivo', label: 'Mercado Objetivo' },
    { name: 'Tendencias', label: 'Tendencias del Mercado' },
    { name: 'Canales', label: 'Canales de Distribución' },
    { name: 'DescripcionPromocion', label: 'Descripción de Promoción' },
    { name: 'Presentacion', label: 'Presentación' },
    { name: 'PasosElaboracion', label: 'Pasos de Elaboración' },
    { name: 'SituacionFinanciera', label: 'Situación Financiera' },
    { name: 'FuenteFinanciero', label: 'Fuentes de Financiamiento' },
    { name: 'EstructuraOrganica', label: 'Estructura Orgánica' },
    { name: 'ConocimientoLegal', label: 'Conocimiento Legal' },
    { name: 'MetodologiaInnovacion', label: 'Metodología de Innovación' },
    { name: 'HerramientaTecnologicas', label: 'Herramientas Tecnológicas' },
    { name: 'Marca', label: 'Marca' },
    { name: 'AplicacionMetodologia', label: 'Aplicación de Metodología' },
    { name: 'ImpactoAmbiental', label: 'Impacto Ambiental' },
    { name: 'ImpactoSocial', label: 'Impacto Social' },
    { name: 'Viabilidad', label: 'Viabilidad del Proyecto' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div className="card">
        <div className="card-header" style={{ backgroundColor: '#0c4a6e', color: 'white' }}>
          <h4 style={{ margin: 0 }}>📋 Diagnóstico - {emprendimiento.Nombre}</h4>
        </div>
        
        <div className="card-body">
          {!diagnostico ? (
            <div className="text-center" style={{ padding: '40px' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                backgroundColor: '#fff3cd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <span style={{ fontSize: '36px' }}>⏳</span>
              </div>
              <h5 style={{ color: '#ffc107', marginBottom: '10px' }}>Diagnóstico Pendiente</h5>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                No hay un diagnóstico registrado para este emprendimiento.
              </p>
              <p className="text-muted">El administrador debe crear el diagnóstico.</p>
            </div>
          ) : (
            <div>
              <div className="alert alert-success d-flex align-items-center" style={{ marginBottom: '20px' }}>
                <span style={{ marginRight: '10px', fontSize: '20px' }}>✅</span>
                <strong>Diagnóstico completado</strong>
              </div>
              <div className="row">
                {camposDiagnostico.map((campo) => (
                  <div key={campo.name} className="col-md-6 mb-3">
                    <div className="p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                      <h6 style={{ margin: '0 0 10px 0', color: '#0c4a6e' }}>{campo.label}</h6>
                      <p style={{ margin: 0, color: '#555', whiteSpace: 'pre-wrap' }}>
                        {diagnostico[campo.name] || 'No especificado'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticoEstudiante;
