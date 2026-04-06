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
  const [filtroEstado, setFiltroEstado] = useState('activo');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders();
      
      const [eventsRes, tiposRes] = await Promise.all([
        fetch(`${API_URL}/segmed/event`, { headers }),
        fetch(`${API_URL}/segmed/type-event`, { headers })
      ]);

      const eventsData = await eventsRes.json();
      const tiposData = await tiposRes.json();

      setEventos(eventsData.data || []);
      setTiposEvento(tiposData.data || []);
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

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    const date = new Date(dateStr);
    return date.toLocaleString('es-CO', { 
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getTipoNombre = (tipoId) => {
    const tipo = tiposEvento.find(t => t.idTipo_evento === tipoId || t.idTipoEvento === tipoId);
    return tipo?.Nombre_tipo_evento || 'General';
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
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ color: '#0c4a6e', marginBottom: '5px' }}>🎉 Eventos</h1>
        <p style={{ color: '#666', margin: 0 }}>Explora los eventos disponibles para tu desarrollo académico</p>
      </div>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <label className="form-label"><strong>Filtrar por tipo</strong></label>
              <select 
                className="form-select"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                {tiposEvento.map(tipo => (
                  <option key={tipo.idTipo_evento || tipo.idTipoEvento} value={tipo.idTipo_evento || tipo.idTipoEvento}>
                    {tipo.Nombre_tipo_evento}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label"><strong>Filtrar por estado</strong></label>
              <select 
                className="form-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="activo">Activos</option>
                <option value="proximo">Próximos</option>
                <option value="inactivo">Inactivos</option>
                <option value="finalizado">Finalizados</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '15px' }}>
          <div style={{ fontSize: '28px', color: '#4CAF50' }}>{eventosActivos.length}</div>
          <div style={{ color: '#666', fontSize: '13px' }}>Eventos Activos</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '15px' }}>
          <div style={{ fontSize: '28px', color: '#1a75bc' }}>{eventosProximos.length}</div>
          <div style={{ color: '#666', fontSize: '13px' }}>Próximos Eventos</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '15px' }}>
          <div style={{ fontSize: '28px', color: '#ffc400' }}>{eventosFiltrados.length}</div>
          <div style={{ color: '#666', fontSize: '13px' }}>Total Mostrado</div>
        </div>
      </div>

      {/* Lista de Eventos */}
      {eventosFiltrados.length === 0 ? (
        <div className="card">
          <div className="card-body text-center" style={{ padding: '50px' }}>
            <p style={{ fontSize: '48px', marginBottom: '15px' }}>📭</p>
            <p style={{ color: '#666', fontSize: '18px' }}>No hay eventos que coincidan con los filtros</p>
          </div>
        </div>
      ) : (
        <div className="row">
          {eventosFiltrados.map((evento) => (
            <div key={evento.ideventos || evento.idEventos} className="col-md-6 mb-4">
              <div className="card h-100" style={{ borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderLeft: `4px solid ${evento.Estado === 'activo' ? '#4CAF50' : evento.Estado === 'proximo' ? '#1a75bc' : '#6c757d'}` }}>
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <h5 style={{ margin: 0, color: '#0c4a6e', flex: 1 }}>{evento.Nombre_evento}</h5>
                    {getEstadoBadge(evento.Estado)}
                  </div>
                  
                  <p style={{ color: '#555', fontSize: '14px', marginBottom: '15px' }}>
                    {evento.Descripcion_evento || 'Sin descripción'}
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', color: '#666' }}>
                    <div>
                      <strong>📅 Fecha:</strong><br />
                      {formatDate(evento.Fecha_inicio)}
                    </div>
                    <div>
                      <strong>🏷️ Tipo:</strong><br />
                      {getTipoNombre(evento.Tipo_evento_idTipo_evento)}
                    </div>
                    {evento.Capacidad_maxima && (
                      <div>
                        <strong>👥 Capacidad:</strong><br />
                        {evento.Capacidad_maxima} personas
                      </div>
                    )}
                    {evento.Lugar && (
                      <div>
                        <strong>📍 Lugar:</strong><br />
                        {evento.Lugar}
                      </div>
                    )}
                  </div>
                  
                  {evento.Requiere_registro === 1 && (
                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '5px', fontSize: '13px' }}>
                      <strong>⚠️ Requiere registro previo</strong>
                    </div>
                  )}
                </div>
                <div className="card-footer" style={{ backgroundColor: '#f8f9fa', borderTop: '1px solid #eee' }}>
                  {evento.Estado === 'activo' ? (
                    <button 
                      className="btn btn-sm w-100"
                      style={{ backgroundColor: '#1a75bc', color: 'white', fontWeight: '500' }}
                    >
                      Registrarse al Evento
                    </button>
                  ) : evento.Estado === 'proximo' ? (
                    <button 
                      className="btn btn-sm w-100"
                      style={{ backgroundColor: '#ffc400', color: '#333', fontWeight: '500' }}
                    >
                      Marcar como Interesado
                    </button>
                  ) : (
                    <button 
                      className="btn btn-sm w-100"
                      style={{ backgroundColor: '#6c757d', color: 'white', fontWeight: '500' }}
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
