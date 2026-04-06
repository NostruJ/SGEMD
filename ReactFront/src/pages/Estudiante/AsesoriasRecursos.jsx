import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const AsesoriasRecursos = () => {
  const [asesorias, setAsesorias] = useState([]);
  const [misAsesorias, setMisAsesorias] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchParams] = useSearchParams();
  const docenteSeleccionado = searchParams.get('docente');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [solicitud, setSolicitud] = useState({
    Nombre_de_asesoria: '',
    Descripcion: '',
    Fecha_asesoria: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders();
      
      const [userRes, asesoriasRes, teachersRes] = await Promise.all([
        fetch(`${API_URL}/segmed/users/me`, { headers, credentials: 'include' }),
        fetch(`${API_URL}/segmed/advice`, { headers }),
        fetch(`${API_URL}/segmed/users/teachers`, { headers })
      ]);

      const userData = await userRes.json();
      const asesoriasData = await asesoriasRes.json();
      const teachersData = await teachersRes.json();

      setUser(userData.data || userData);
      setDocentes(teachersData.data || []);

      const todasAsesorias = asesoriasData.data || [];
      setAsesorias(todasAsesorias);

      const userId = userData.data?.idusuarios || userData.data?.idUsuarios;
      if (userId) {
        const mias = todasAsesorias.filter(a => a.Usuarios_idUsuarios === userId);
        setMisAsesorias(mias);
      }

      if (docenteSeleccionado) {
        setMostrarFormulario(true);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    return new Date(dateStr).toLocaleDateString('es-CO', { 
      day: '2-digit', month: 'short', year: 'numeric' 
    });
  };

  const getEstadoBadge = (estado) => {
    const estilos = {
      'completada': { bg: '#4CAF50', texto: 'white', label: 'Completada' },
      'confirmada': { bg: '#1a75bc', texto: 'white', label: 'Confirmada' },
      'pendiente': { bg: '#ffc400', texto: '#333', label: 'Pendiente' },
      'cancelada': { bg: '#dc3545', texto: 'white', label: 'Cancelada' }
    };
    const estilo = estilos[estado] || estilos['pendiente'];
    return (
      <span style={{ 
        padding: '4px 12px', 
        borderRadius: '12px', 
        backgroundColor: estilo.bg, 
        color: estilo.texto,
        fontSize: '12px',
        fontWeight: '500'
      }}>
        {estilo.label}
      </span>
    );
  };

  const getDocenteNombre = (docenteId) => {
    const docente = docentes.find(d => d.idusuarios === docenteId || d.idUsuarios === docenteId);
    return docente?.Nombre || 'Docente';
  };

  const handleEnviarSolicitud = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setMensaje(null);

    try {
      const userId = user?.idusuarios || user?.idUsuarios;

      const response = await fetch(`${API_URL}/segmed/advice`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          Nombre_de_asesoria: solicitud.Nombre_de_asesoria,
          Descripcion: solicitud.Descripcion,
          Fecha_asesoria: solicitud.Fecha_asesoria,
          Comentarios: '',
          Usuarios_idUsuarios: userId,
          confirmacion: 'pendiente',
          Modalidad_idModalidad: 1,
          Fecha_y_Horarios_idFecha_y_Horarios: 1,
          Fecha_creacion: new Date().toISOString().split('T')[0],
          Fecha_actualizacion: new Date().toISOString().split('T')[0]
        })
      });

      const result = await response.json();

      if (result.success) {
        setMensaje({ tipo: 'success', texto: 'Solicitud de asesoría enviada correctamente' });
        setSolicitud({ Nombre_de_asesoria: '', Descripcion: '', Fecha_asesoria: '' });
        setMostrarFormulario(false);
        fetchData();
      } else {
        setMensaje({ tipo: 'error', texto: result.error || 'Error al enviar la solicitud' });
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error de conexión' });
    } finally {
      setEnviando(false);
    }
  };

  const asesoriasDisponibles = asesorias.filter(a => 
    a.Estado !== 'cancelada' && !misAsesorias.some(ma => ma.idAsesorias === a.idAsesorias)
  );

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
      {/* Formulario de solicitud de asesoría */}
      {mostrarFormulario && docenteSeleccionado ? (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', border: '2px solid #1a75bc' }}>
          <div className="card-header" style={{ backgroundColor: '#1a75bc', color: 'white' }}>
            <h5 style={{ margin: 0 }}>📝 Solicitar Asesoría</h5>
          </div>
          <div className="card-body">
            {mensaje && (
              <div className={`alert ${mensaje.tipo === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                {mensaje.texto}
              </div>
            )}
            <form onSubmit={handleEnviarSolicitud}>
              <div className="mb-3">
                <label className="form-label">Docente</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={getDocenteNombre(parseInt(docenteSeleccionado))} 
                  disabled 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Nombre de la Asesoría *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={solicitud.Nombre_de_asesoria}
                  onChange={(e) => setSolicitud({...solicitud, Nombre_de_asesoria: e.target.value})}
                  placeholder="Ej: Asesoría de planeación"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción *</label>
                <textarea 
                  className="form-control" 
                  rows="3"
                  value={solicitud.Descripcion}
                  onChange={(e) => setSolicitud({...solicitud, Descripcion: e.target.value})}
                  placeholder="Describe brevemente qué necesitas..."
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha Solicitada *</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={solicitud.Fecha_asesoria}
                  onChange={(e) => setSolicitud({...solicitud, Fecha_asesoria: e.target.value})}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={enviando}
                >
                  {enviando ? 'Enviando...' : 'Enviar Solicitud'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setMostrarFormulario(false);
                    setSolicitud({ Nombre_de_asesoria: '', Descripcion: '', Fecha_asesoria: '' });
                    window.history.back();
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#0c4a6e', marginBottom: '5px' }}>📚 Asesorías</h1>
          <p style={{ color: '#666', margin: 0 }}>Gestión de asesorías disponibles y solicitadas</p>
        </div>
        <Link 
          to="/estudiante/recursos/docentes"
          style={{
            padding: '10px 20px',
            backgroundColor: '#1a75bc',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: '500'
          }}
        >
          + Nueva Solicitud
        </Link>
      </div>

      {/* Mis Asesorías */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header" style={{ backgroundColor: '#0c4a6e', color: 'white' }}>
          <h5 style={{ margin: 0 }}>Mis Asesorías</h5>
        </div>
        <div className="card-body">
          {misAsesorias.length === 0 ? (
            <div className="text-center" style={{ padding: '30px', color: '#666' }}>
              <p style={{ fontSize: '32px', marginBottom: '10px' }}>📋</p>
              <p>No tienes asesorías registradas</p>
              <Link 
                to="/estudiante/recursos/docentes"
                style={{ color: '#1a75bc', fontWeight: 'bold' }}
              >
                Solicitar una asesoría →
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead style={{ backgroundColor: '#f4f4f4' }}>
                  <tr>
                    <th>Nombre</th>
                    <th>Fecha</th>
                    <th>Docente</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {misAsesorias.map((asesoria) => (
                    <tr key={asesoria.idAsesorias}>
                      <td style={{ fontWeight: '500' }}>{asesoria.Nombre_de_asesoria}</td>
                      <td>{formatDate(asesoria.Fecha_asesoria)}</td>
                      <td>{getDocenteNombre(asesoria.Docentes_idDocentes)}</td>
                      <td>{getEstadoBadge(asesoria.confirmacion || asesoria.Estado)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Asesorías Disponibles */}
      <div className="card">
        <div className="card-header" style={{ backgroundColor: '#1a75bc', color: 'white' }}>
          <h5 style={{ margin: 0 }}>Asesorías Disponibles</h5>
        </div>
        <div className="card-body">
          {asesoriasDisponibles.length === 0 ? (
            <div className="text-center" style={{ padding: '30px', color: '#666' }}>
              <p style={{ fontSize: '32px', marginBottom: '10px' }}>📭</p>
              <p>No hay asesorías disponibles actualmente</p>
            </div>
          ) : (
            <div className="row">
              {asesoriasDisponibles.map((asesoria) => (
                <div key={asesoria.idAsesorias} className="col-md-6 mb-3">
                  <div style={{ 
                    padding: '15px', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px',
                    backgroundColor: '#fafafa'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <h6 style={{ margin: '0 0 10px 0', color: '#0c4a6e' }}>
                          {asesoria.Nombre_de_asesoria}
                        </h6>
                        <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                          {asesoria.Descripcion?.substring(0, 100)}...
                        </p>
                        <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                          📅 {formatDate(asesoria.Fecha_asesoria)}
                        </p>
                      </div>
                      <div>
                        {getEstadoBadge(asesoria.confirmacion || 'pendiente')}
                      </div>
                    </div>
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                      <span style={{ fontSize: '13px', color: '#666' }}>
                        👤 Docente: <strong>{getDocenteNombre(asesoria.Docentes_idDocentes)}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default AsesoriasRecursos;