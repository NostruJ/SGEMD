import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const EventosEstudiante = () => {
  const [eventos, setEventos] = useState([]);
  const [tiposEvento, setTiposEvento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [userId, setUserId] = useState(null);
  const [misEventos, setMisEventos] = useState([]);
  const [registrando, setRegistrando] = useState(null);

  useEffect(() => {
    fetchUserAndEvents();
  }, []);

  const fetchUserAndEvents = async () => {
    try {
      const headers = getAuthHeaders();
      
      const userRes = await fetch(`${API_URL}/segmed/users/me`, { 
        headers, 
        credentials: 'include' 
      });
      const userData = await userRes.json();
      const currentUserId = userData.data?.idusuarios || userData.data?.idUsuarios;
      setUserId(currentUserId);
      
      const [eventsRes, tiposRes, misEventosRes] = await Promise.all([
        fetch(`${API_URL}/segmed/event`, { headers }),
        fetch(`${API_URL}/segmed/type-event`, { headers }),
        currentUserId ? fetch(`${API_URL}/segmed/event/user/${currentUserId}`, { headers }) : Promise.resolve({ json: () => ({ data: [] }) })
      ]);

      const eventsData = await eventsRes.json();
      const tiposData = await tiposRes.json();
      const misEventosData = await misEventosRes.json();

      setEventos(eventsData.data || []);
      setTiposEvento(tiposData.data || []);
      setMisEventos(misEventosData.data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    await fetchUserAndEvents();
  };

  const handleRegistro = async (eventoId) => {
    if (!userId) {
      alert('Error: No se pudo identificar al usuario');
      return;
    }
    setRegistrando(eventoId);
    try {
      const res = await fetch(`${API_URL}/segmed/event/${eventoId}/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ usuarioId: userId }),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        alert('Te has registrado exitosamente en el evento');
        fetchData();
      } else {
        alert(data.error || 'Error al registrarse');
      }
    } catch (err) {
      alert('Error al registrarse');
    } finally {
      setRegistrando(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    return new Date(dateStr).toLocaleDateString('es-CO', { 
      day: '2-digit', month: 'short', year: 'numeric' 
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    const date = new Date(dateStr);
    return date.toLocaleString('es-CO', { 
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getTipoNombre = (tipo) => {
    if (!tipo) return 'General';
    if (tipo.Academico === '1' || tipo.Academico === 1) return 'Académico';
    if (tipo.Cultura === '1' || tipo.Cultura === 1) return 'Cultura';
    if (tipo.Deportivo === '1' || tipo.Deportivo === 1) return 'Deportivo';
    if (tipo.Social === '1' || tipo.Social === 1) return 'Social';
    if (tipo.Conferencia === '1' || tipo.Conferencia === 1) return 'Conferencia';
    return 'General';
  };

  const getTipoNombreFromId = (tipoId) => {
    const tipo = tiposEvento.find(t => t.idTipo_evento === tipoId || t.idTipoEvento === tipoId);
    return getTipoNombre(tipo);
  };

  const getEstadoBadge = (estado) => {
    const estilos = {
      'activo': { bg: '#4CAF50', texto: 'white', label: 'Activo' },
      'inactivo': { bg: '#6c757d', texto: 'white', label: 'Inactivo' },
      'finalizado': { bg: '#dc3545', texto: 'white', label: 'Finalizado' },
      'proximo': { bg: '#1a75bc', texto: 'white', label: 'Próximo' }
    };
    const estilo = estilos[estado] || estilos['proximo'];
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

  const eventosFiltrados = eventos.filter(evento => {
    const coincideTipo = !filtroTipo || evento.Tipo_evento_idTipo_evento == filtroTipo;
    const coincideEstado = !filtroEstado || evento.Estado === filtroEstado;
    return coincideTipo && coincideEstado;
  });

  const eventosActivos = eventosFiltrados.filter(e => e.Estado === 'activo');
  const eventosProximos = eventosFiltrados.filter(e => e.Estado === 'proximo');

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
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '25px', borderBottom: '2px solid #1a75bc', paddingBottom: '15px' }}>
        <h1 style={{ color: '#0c4a6e', marginBottom: '8px', fontSize: '28px', fontWeight: '600' }}>
          🎉 Eventos Disponibles
        </h1>
        <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
          Explora los eventos disponibles para tu desarrollo académico y profesional
        </p>
      </div>

      <div className="card" style={{ marginBottom: '20px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div className="card-body" style={{ padding: '20px' }}>
          <div className="row align-items-end">
            <div className="col-md-5">
              <label className="form-label" style={{ fontWeight: '500', color: '#0c4a6e', marginBottom: '8px' }}>
                📋 Tipo de Evento
              </label>
              <select 
                className="form-select"
                style={{ borderRadius: '8px' }}
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                {tiposEvento.map(tipo => (
                  <option key={tipo.idTipo_evento || tipo.idTipoEvento} value={tipo.idTipo_evento || tipo.idTipoEvento}>
                    {getTipoNombre(tipo)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-5">
              <label className="form-label" style={{ fontWeight: '500', color: '#0c4a6e', marginBottom: '8px' }}>
                📊 Estado
              </label>
              <select 
                className="form-select"
                style={{ borderRadius: '8px' }}
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="activo">✅ Activos</option>
                <option value="proximo">📅 Próximos</option>
                <option value="inactivo">❌ Inactivos</option>
                <option value="finalizado">🏁 Finalizados</option>
              </select>
            </div>
            <div className="col-md-2">
              <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a75bc' }}>{eventosFiltrados.length}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Resultados</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {eventosFiltrados.length === 0 ? (
        <div className="card" style={{ border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div className="card-body text-center" style={{ padding: '60px' }}>
            <p style={{ fontSize: '64px', marginBottom: '20px' }}>📭</p>
            <p style={{ color: '#666', fontSize: '18px', marginBottom: '10px' }}>No hay eventos disponibles</p>
            <p style={{ color: '#999', fontSize: '14px' }}>Intenta con otros filtros de búsqueda</p>
          </div>
        </div>
      ) : (
        <div className="row">
          {eventosFiltrados.map((evento) => (
            <div key={evento.ideventos || evento.idEventos} className="col-lg-6 mb-4">
              <div className="card h-100" style={{ borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: 'none', overflow: 'hidden' }}>
                <div style={{ height: '6px', backgroundColor: evento.Estado === 'activo' ? '#4CAF50' : evento.Estado === 'proximo' ? '#1a75bc' : '#6c757d' }}></div>
                <div className="card-body" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <h5 style={{ margin: 0, color: '#0c4a6e', flex: 1, fontSize: '18px', fontWeight: '600' }}>{evento.Nombre_evento}</h5>
                    {getEstadoBadge(evento.Estado)}
                  </div>
                  
                  <p style={{ color: '#555', fontSize: '14px', marginBottom: '15px', lineHeight: '1.5' }}>
                    {evento.Descripcion_evento || 'Sin descripción disponible'}
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#666', backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
                    <div>
                      <span style={{ fontWeight: '600', color: '#0c4a6e' }}>🏷️ Tipo:</span><br />
                      {getTipoNombreFromId(evento.Tipo_evento_idTipo_evento)}
                    </div>
                    {evento.Capacidad_maxima && (
                      <div>
                        <span style={{ fontWeight: '600', color: '#0c4a6e' }}>👥 Capacidad:</span><br />
                        {evento.Capacidad_maxima} personas
                      </div>
                    )}
                  </div>
                  
                  {evento.Requiere_registro === 1 && (
                    <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '6px', fontSize: '12px', textAlign: 'center' }}>
                      <strong style={{ color: '#856404' }}>⚠️ Requiere registro previo</strong>
                    </div>
                  )}
                </div>
                <div className="card-footer" style={{ backgroundColor: '#fff', borderTop: '1px solid #eee', padding: '15px' }}>
                  {misEventos.some(e => e.idEventos === evento.idEventos) ? (
                    <button 
                      className="btn w-100"
                      style={{ backgroundColor: '#4CAF50', color: 'white', fontWeight: '500', borderRadius: '8px', padding: '10px' }}
                      disabled
                    >
                      ✓ Ya estás registrado
                    </button>
                  ) : evento.Estado === 'activo' || evento.Estado === 'proximo' ? (
                    <button 
                      className="btn w-100"
                      style={{ backgroundColor: '#1a75bc', color: 'white', fontWeight: '500', borderRadius: '8px', padding: '10px' }}
                      onClick={() => handleRegistro(evento.idEventos)}
                      disabled={registrando === evento.idEventos}
                    >
                      {registrando === evento.idEventos ? '⏳ Procesando...' : evento.Estado === 'proximo' ? '🙋 Marcar como Interesado' : '📝 Registrarse al Evento'}
                    </button>
                  ) : (
                    <button 
                      className="btn w-100"
                      style={{ backgroundColor: '#6c757d', color: 'white', fontWeight: '500', borderRadius: '8px', padding: '10px' }}
                      disabled
                    >
                      No Disponible
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventosEstudiante;
