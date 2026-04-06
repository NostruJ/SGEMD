import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const PerfilEmprendimiento = () => {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [emprendimientoSeleccionado, setEmprendimientoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmprendimientos();
  }, []);

  const fetchEmprendimientos = async () => {
    try {
      const res = await fetch(`${API_URL}/segmed/users/me`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const userData = await res.json();
      
      if (!userData.success) {
        setError('Error al obtener usuario');
        return;
      }

      const userId = userData.data.idUsuarios;
      
      const empRes = await fetch(`${API_URL}/segmed/users/${userId}/entrepreneurships`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const empData = await empRes.json();
      
      if (empData.success && empData.data && empData.data.length > 0) {
        setEmprendimientos(empData.data);
        setEmprendimientoSeleccionado(empData.data[0]);
      } else {
        setEmprendimientos([]);
        setEmprendimientoSeleccionado(null);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar emprendimiento');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmprendimiento = (emp) => {
    setEmprendimientoSeleccionado(emp);
  };

  const getEtapaNombre = (id) => {
    const etapas = {
      1: 'Idea',
      2: 'Prototipo',
      3: 'Validación',
      4: 'Lanzamiento'
    };
    return etapas[id] || `Etapa ${id}`;
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

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h4 className="mb-0 text-primary">Perfil de Emprendimiento</h4>
        </div>
        <div className="card-body">
          {emprendimientos.length === 0 ? (
            <div className="text-center py-5">
              <p style={{ fontSize: '48px', marginBottom: '15px' }}>📋</p>
              <p className="text-muted mb-3">Aún no tienes un emprendimiento asignado.</p>
              <p className="text-muted">Contacta al administrador para que te asigne uno.</p>
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
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p><strong>Nombre:</strong> {emprendimientoSeleccionado.Nombre}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Tipo:</strong> {emprendimientoSeleccionado.TipoEmprendimiento}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p><strong>Descripción:</strong></p>
                    <p className="text-muted">{emprendimientoSeleccionado.Descripcion || 'Sin descripción'}</p>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p><strong>Sector Productivo:</strong> {emprendimientoSeleccionado.SectorProductivo || 'No especificado'}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Etapa Actual:</strong> {getEtapaNombre(emprendimientoSeleccionado.EtapaEmprendimiento_idEtapaEmprendimiento)}</p>
                    </div>
                  </div>
                  <div className="mb-3">
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

export default PerfilEmprendimiento;
