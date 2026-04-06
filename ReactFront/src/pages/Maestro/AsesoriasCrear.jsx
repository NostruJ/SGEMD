import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const AsesoriasCrear = () => {
  const navigate = useNavigate();
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    Nombre_de_asesoria: '',
    Descripcion: '',
    Fecha_asesoria: '',
    Estudiantes_idEstudiante: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/segmed/users/me`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success || data.data) {
        setUser(data.data || data);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const buscarEstudiantes = async () => {
    if (estudiantes.length > 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_URL}/segmed/users`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      
      console.log('Users response:', res.status, data);
      
      if (data.success && data.data) {
        const estudiantesFiltrados = data.data.filter(u => u.Roles_idRoles1 === 2);
        setEstudiantes(estudiantesFiltrados);
        
        if (estudiantesFiltrados.length === 0) {
          setError('No se encontraron estudiantes');
        }
      } else {
        setError('Error al cargar usuarios: ' + (data.error || ''));
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (!form.Nombre_de_asesoria.trim()) {
      setError('El nombre de la asesoría es requerido');
      setSaving(false);
      return;
    }
    if (!form.Fecha_asesoria) {
      setError('La fecha y hora son requeridas');
      setSaving(false);
      return;
    }
    if (!form.Estudiantes_idEstudiante) {
      setError('Selecciona un estudiante');
      setSaving(false);
      return;
    }

    try {
      const docenteId = user?.idusuarios || user?.idUsuarios;
      
      const res = await fetch(`${API_URL}/segmed/advice`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          Nombre_de_asesoria: form.Nombre_de_asesoria,
          Descripcion: form.Descripcion || '',
          Fecha_asesoria: form.Fecha_asesoria,
          confirmacion: 'pendiente',
          Usuarios_idUsuarios: parseInt(form.Estudiantes_idEstudiante),
          Docentes_idDocentes: docenteId,
          Modalidad_idModalidad: 1,
          Fecha_y_Horarios_idFecha_y_Horarios: 1,
          Fecha_creacion: new Date().toISOString().split('T')[0],
          Fecha_actualizacion: new Date().toISOString().split('T')[0]
        }),
        credentials: 'include'
      });
      const data = await res.json();
      console.log('Create response:', res.status, data);
      
      if (data.success) {
        setSuccess('Asesoría creada exitosamente');
        setTimeout(() => {
          navigate('/maestro/asesorias');
        }, 1500);
      } else {
        setError(data.error || 'Error al crear asesoría');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: '#0c4a6e', 
          color: 'white', 
          padding: '20px 25px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <span style={{ fontSize: '24px' }}>📚</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px' }}>Crear Nueva Asesoría</h2>
            <small style={{ opacity: 0.8 }}>Completa el formulario para crear una nueva asesoría</small>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '25px' }}>
          {error && (
            <div style={{ 
              padding: '12px 15px', 
              backgroundColor: '#fee2e2', 
              color: '#dc2626',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #fecaca'
            }}>
              ⚠️ {error}
            </div>
          )}
          
          {success && (
            <div style={{ 
              padding: '12px 15px', 
              backgroundColor: '#dcfce7', 
              color: '#16a34a',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #bbf7d0'
            }}>
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Nombre */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#0c4a6e' 
              }}>
                Nombre de la Asesoría *
              </label>
              <input
                type="text"
                className="form-control"
                name="Nombre_de_asesoria"
                value={form.Nombre_de_asesoria}
                onChange={handleChange}
                placeholder="Ej: Revisión de plan de trabajo"
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #d1d5db',
                  fontSize: '15px'
                }}
                required
              />
            </div>

            {/* Estudiante */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#0c4a6e' 
              }}>
                Estudiante *
              </label>
              
              {estudiantes.length === 0 ? (
                <button
                  type="button"
                  onClick={buscarEstudiantes}
                  className="btn"
                  style={{ 
                    backgroundColor: '#1a75bc', 
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px'
                  }}
                  disabled={loading}
                >
                  {loading ? 'Cargando estudiantes...' : '🔍 Buscar Estudiantes'}
                </button>
              ) : (
                <select
                  className="form-select"
                  name="Estudiantes_idEstudiante"
                  value={form.Estudiantes_idEstudiante}
                  onChange={handleChange}
                  style={{ 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '1px solid #d1d5db',
                    fontSize: '15px'
                  }}
                  required
                >
                  <option value="">Seleccionar estudiante...</option>
                  {estudiantes.map(est => (
                    <option key={est.idusuarios || est.idUsuarios} value={est.idusuarios || est.idUsuarios}>
                      {est.Nombre || 'Estudiante sin nombre'}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Fecha */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#0c4a6e' 
              }}>
                Fecha y Hora *
              </label>
              <input
                type="datetime-local"
                className="form-control"
                name="Fecha_asesoria"
                value={form.Fecha_asesoria}
                onChange={handleChange}
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #d1d5db',
                  fontSize: '15px'
                }}
                required
              />
            </div>

            {/* Descripción */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#0c4a6e' 
              }}>
                Descripción
              </label>
              <textarea
                className="form-control"
                name="Descripcion"
                rows="4"
                value={form.Descripcion}
                onChange={handleChange}
                placeholder="Describe los objetivos de esta asesoría..."
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #d1d5db',
                  fontSize: '15px',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="submit" 
                className="btn"
                style={{ 
                  backgroundColor: '#1a75bc', 
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none'
                }}
                disabled={saving}
              >
                {saving ? '⏳ Guardando...' : '💾 Crear Asesoría'}
              </button>
              <Link 
                to="/maestro/asesorias" 
                className="btn"
                style={{ 
                  backgroundColor: '#6b7280', 
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none'
                }}
              >
                ❌ Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AsesoriasCrear;