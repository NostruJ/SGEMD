import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const EmpSeguimiento = () => {
  const [searchParams] = useSearchParams();
  const empId = searchParams.get('id');
  
  const [emprendimiento, setEmprendimiento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notas, setNotas] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (empId) {
      loadData();
    }
  }, [empId]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const empResponse = await fetch(`${API_URL}/segmed/entrepreneurship/${empId}`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const empJson = await empResponse.json();
      
      if (!empJson.success) {
        setError('Emprendimiento no encontrado');
        setLoading(false);
        return;
      }
      
      setEmprendimiento(empJson.data);
      
      const tracingResponse = await fetch(`${API_URL}/segmed/tracing/emprendimiento/${empId}`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const tracingJson = await tracingResponse.json();
      
      setNotas(tracingJson.data || []);
      
    } catch (err) {
      setError('Error al cargar datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !empId) return;
    setSaving(true);
    
    try {
      const res = await fetch(`${API_URL}/segmed/tracing`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          Descripcion: newNote,
          TipoSeguimiento: 'Nota',
          histproal: 'Seguimiento',
          Emprendimiento_idEmprendimiento: parseInt(empId)
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setNewNote('');
        loadData();
      } else {
        alert('Error: ' + (data.error || 'Error desconocido'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (notaId) => {
    if (!confirm('¿Eliminar esta nota?')) return;
    
    try {
      const res = await fetch(`${API_URL}/segmed/tracing/${notaId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      
      const data = await res.json();
      if (data.success) {
        loadData();
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const etapas = ['Idea', 'Prototipo', 'Lanzamiento', 'Crecimiento', 'Consolidación'];
  const etapaActual = emprendimiento?.EtapaEmprendimiento_idEtapaEmprendimiento || 1;

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div className="spinner-border text-primary" role="status" />
        <p>Cargando...</p>
      </div>
    );
  }

  if (!empId) {
    return (
      <div style={{ padding: '20px' }}>
        <div className="alert alert-warning">
          Selecciona un emprendimiento para ver su seguimiento.
          <Link to="/maestro/emprendimientos/perfil" className="btn btn-sm btn-primary ms-2">
            Ver Emprendimientos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div className="card" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div className="card-header" style={{ backgroundColor: '#f8f9fa', borderRadius: '12px 12px 0 0' }}>
          <h4 style={{ color: '#0c4a6e', margin: 0 }}>
            📋 Seguimiento: {emprendimiento?.Nombre || 'Cargando...'}
          </h4>
        </div>
        
        <div className="card-body">
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}
          
          {emprendimiento && (
            <div className="row mb-4" style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
              <div className="col-md-6">
                <p><strong>Tipo:</strong> {emprendimiento.TipoEmprendimiento || 'N/A'}</p>
                <p><strong>Sector:</strong> {emprendimiento.SectorProductivo || 'N/A'}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Etapa:</strong> 
                  <span className="badge" style={{ backgroundColor: '#1a75bc', marginLeft: '8px' }}>
                    {etapas[etapaActual - 1] || 'Idea'}
                  </span>
                </p>
                <p><strong>Descripción:</strong> {emprendimiento.Descripcion || 'Sin descripción'}</p>
              </div>
            </div>
          )}
          
          <div style={{ marginBottom: '20px' }}>
            <h5 style={{ color: '#0c4a6e' }}>Agregar Nota de Seguimiento</h5>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Escribe una nota de seguimiento..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              style={{ marginBottom: '10px' }}
            />
            <button
              className="btn"
              style={{ backgroundColor: '#1a75bc', color: 'white' }}
              onClick={handleAddNote}
              disabled={saving || !newNote.trim()}
            >
              {saving ? 'Guardando...' : '💾 Guardar Nota'}
            </button>
          </div>
          
          <h5 style={{ color: '#0c4a6e' }}>Historial de Seguimiento</h5>
          
          {notas.length === 0 ? (
            <div className="alert alert-info">
              No hay notas de seguimiento aún.
            </div>
          ) : (
            <div>
              {notas.map((nota, idx) => (
                <div key={idx} className="card mb-2" style={{ borderLeft: '4px solid #1a75bc' }}>
                  <div className="card-body" style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <small style={{ color: '#666' }}>
                          {nota.FechaCreacion ? new Date(nota.FechaCreacion).toLocaleDateString('es-CO') : 'Sin fecha'}
                        </small>
                        <p style={{ margin: '5px 0 0 0' }}>{nota.Descripcion}</p>
                      </div>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteNote(nota.idSeguimientos)}
                        style={{ padding: '4px 8px' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div style={{ marginTop: '20px' }}>
            <Link 
              to="/maestro/emprendimientos/perfil" 
              className="btn btn-secondary"
            >
              ← Volver a Emprendimientos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpSeguimiento;
