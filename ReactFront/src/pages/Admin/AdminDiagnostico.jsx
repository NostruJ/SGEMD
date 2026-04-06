import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const AdminDiagnostico = () => {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [emprendimientoSeleccionado, setEmprendimientoSeleccionado] = useState(null);
  const [diagnostico, setDiagnostico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({});

  const camposDiagnostico = [
    { name: 'AreaEstrategia', label: 'Área de Estrategia', type: 'textarea' },
    { name: 'Diferencial', label: 'Factor Diferencial', type: 'textarea' },
    { name: 'Planeacion', label: 'Planificación', type: 'textarea' },
    { name: 'MercadoObjetivo', label: 'Mercado Objetivo', type: 'textarea' },
    { name: 'Tendencias', label: 'Tendencias del Mercado', type: 'textarea' },
    { name: 'Canales', label: 'Canales de Distribución', type: 'textarea' },
    { name: 'DescripcionPromocion', label: 'Descripción de Promoción', type: 'textarea' },
    { name: 'Presentacion', label: 'Presentación', type: 'textarea' },
    { name: 'PasosElaboracion', label: 'Pasos de Elaboración', type: 'textarea' },
    { name: 'SituacionFinanciera', label: 'Situación Financiera', type: 'textarea' },
    { name: 'FuenteFinanciero', label: 'Fuentes de Financiamiento', type: 'textarea' },
    { name: 'EstructuraOrganica', label: 'Estructura Orgánica', type: 'textarea' },
    { name: 'ConocimientoLegal', label: 'Conocimiento Legal', type: 'textarea' },
    { name: 'MetodologiaInnovacion', label: 'Metodología de Innovación', type: 'textarea' },
    { name: 'HerramientaTecnologicas', label: 'Herramientas Tecnológicas', type: 'textarea' },
    { name: 'Marca', label: 'Marca', type: 'text' },
    { name: 'AplicacionMetodologia', label: 'Aplicación de Metodología', type: 'textarea' },
    { name: 'ImpactoAmbiental', label: 'Impacto Ambiental', type: 'textarea' },
    { name: 'ImpactoSocial', label: 'Impacto Social', type: 'textarea' },
    { name: 'Viabilidad', label: 'Viabilidad del Proyecto', type: 'textarea' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders();
      
      const [empRes, diagRes] = await Promise.all([
        fetch(`${API_URL}/segmed/entrepreneurship`, { headers }),
        fetch(`${API_URL}/segmed/diagnosis`, { headers })
      ]);

      const empData = await empRes.json();
      const diagData = await diagRes.json();

      setEmprendimientos(empData.data || []);
      setDiagnosticos(diagData.data || []);

      if (empData.data?.length > 0) {
        setEmprendimientoSeleccionado(empData.data[0]);
        cargarDiagnostico(empData.data[0].idEmprendimiento, diagData.data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarDiagnostico = (empId, todosDiagnosticos) => {
    const diag = todosDiagnosticos.find(d => d.Emprendimiento_idEmprendimiento === empId);
    setDiagnostico(diag || null);
    setFormData(diag || {});
    setEditando(false);
  };

  const handleSelectEmprendimiento = (empId) => {
    const emp = emprendimientos.find(e => e.idEmprendimiento === empId);
    setEmprendimientoSeleccionado(emp);
    cargarDiagnostico(empId, diagnosticos);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      const headers = getAuthHeaders();
      const payload = {
        ...formData,
        FechaEmprendimiento: new Date().toISOString().split('T')[0],
        Emprendimiento_idEmprendimiento: emprendimientoSeleccionado.idEmprendimiento
      };

      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
          payload[key] = null;
        }
      });

      let res;
      if (diagnostico) {
        res = await fetch(`${API_URL}/segmed/diagnosis/${diagnostico.idDiagnosticos}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_URL}/segmed/diagnosis`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      
      if (data.success) {
        alert(diagnostico ? 'Diagnóstico actualizado' : 'Diagnóstico creado');
        fetchData();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async () => {
    if (!diagnostico) return;
    if (!confirm('¿Estás seguro de eliminar este diagnóstico?')) return;

    try {
      const headers = getAuthHeaders();
      const res = await fetch(`${API_URL}/segmed/diagnosis/${diagnostico.idDiagnosticos}`, {
        method: 'DELETE',
        headers
      });
      const data = await res.json();
      
      if (data.success) {
        alert('Diagnóstico eliminado');
        fetchData();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const iniciarEdicion = () => {
    setFormData(diagnostico || {});
    setEditando(true);
  };

  const cancelarEdicion = () => {
    setFormData(diagnostico || {});
    setEditando(false);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{ color: '#0c4a6e', marginBottom: '5px' }}>📋 Gestión de Diagnósticos</h1>
          <p style={{ color: '#666', margin: 0 }}>Crea y gestiona los diagnósticos de los emprendimientos</p>
        </div>
        <Link to="/admin" className="btn btn-outline-secondary">← Volver al Panel</Link>
      </div>

      {emprendimientos.length === 0 ? (
        <div className="card">
          <div className="card-body text-center" style={{ padding: '50px' }}>
            <p style={{ fontSize: '48px', marginBottom: '15px' }}>📋</p>
            <h4 style={{ color: '#0c4a6e' }}>No hay emprendimientos</h4>
            <p className="text-muted">Crea primero un emprendimiento para gestionar diagnósticos.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label"><strong>Seleccionar Emprendimiento:</strong></label>
                  <select 
                    className="form-select"
                    value={emprendimientoSeleccionado?.idEmprendimiento || ''}
                    onChange={(e) => handleSelectEmprendimiento(parseInt(e.target.value))}
                  >
                    {emprendimientos.map(emp => (
                      <option key={emp.idEmprendimiento} value={emp.idEmprendimiento}>
                        {emp.Nombre} - {emp.SectorProductivo || 'Sin sector'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center h-100">
                    {diagnostico ? (
                      <div className="badge bg-success p-2">✓ Diagnóstico existente</div>
                    ) : (
                      <div className="badge bg-warning text-dark p-2">⏳ Sin diagnóstico</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {emprendimientoSeleccionado && (
            <div className="card">
              <div className="card-header" style={{ backgroundColor: '#0c4a6e', color: 'white' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 style={{ margin: 0 }}>📋 Diagnóstico: {emprendimientoSeleccionado.Nombre}</h5>
                  {!editando && (
                    <div>
                      {diagnostico ? (
                        <>
                          <button className="btn btn-sm btn-light me-2" onClick={iniciarEdicion}>✏️ Editar</button>
                          <button className="btn btn-sm btn-danger" onClick={handleEliminar}>🗑️ Eliminar</button>
                        </>
                      ) : (
                        <button className="btn btn-sm btn-light" onClick={iniciarEdicion}>➕ Crear Diagnóstico</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="card-body">
                {editando ? (
                  <>
                    <div className="row">
                      {camposDiagnostico.map(campo => (
                        <div key={campo.name} className="col-md-6 mb-3">
                          <label className="form-label"><strong>{campo.label}</strong></label>
                          {campo.type === 'textarea' ? (
                            <textarea
                              className="form-control"
                              name={campo.name}
                              value={formData[campo.name] || ''}
                              onChange={handleChange}
                              rows="3"
                            />
                          ) : (
                            <input
                              type="text"
                              className="form-control"
                              name={campo.name}
                              value={formData[campo.name] || ''}
                              onChange={handleChange}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="text-end mt-3">
                      <button className="btn btn-secondary me-2" onClick={cancelarEdicion}>Cancelar</button>
                      <button className="btn btn-primary" onClick={handleGuardar} disabled={guardando}>
                        {guardando ? 'Guardando...' : '💾 Guardar Diagnóstico'}
                      </button>
                    </div>
                  </>
                ) : diagnostico ? (
                  <div className="row">
                    {camposDiagnostico.map(campo => (
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
                ) : (
                  <div className="text-center py-5">
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
                    <h5 style={{ color: '#ffc107', marginBottom: '10px' }}>Sin Diagnóstico</h5>
                    <p style={{ color: '#666', marginBottom: '20px' }}>
                      Este emprendimiento no tiene un diagnóstico registrado.
                    </p>
                    <button className="btn btn-primary" onClick={iniciarEdicion}>
                      ➕ Crear Diagnóstico
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDiagnostico;
