import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const AsesoriasEditar = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const asesoriaId = searchParams.get('id');
  
  const [asesoria, setAsesoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    Nombre_de_asesoria: '',
    Descripcion: '',
    Fecha_asesoria: '',
    confirmacion: 'pendiente'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (asesoriaId) {
      fetchAsesoria();
    } else {
      setLoading(false);
    }
  }, [asesoriaId]);

  const fetchAsesoria = async () => {
    try {
      console.log('Fetching asesoria:', asesoriaId);
      const res = await fetch(`${API_URL}/segmed/advice/${asesoriaId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      console.log('Asesoria response:', res.status, data);

      if (data.success && data.data) {
        setAsesoria(data.data);
        setForm({
          Nombre_de_asesoria: data.data.Nombre_de_asesoria || '',
          Descripcion: data.data.Descripcion || '',
          Fecha_asesoria: data.data.Fecha_asesoria ? data.data.Fecha_asesoria.slice(0, 16) : '',
          confirmacion: data.data.confirmacion || 'pendiente'
        });
      } else {
        setError('Asesoría no encontrada');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar asesoría');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/segmed/advice/${asesoriaId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...form,
          Fecha_actualizacion: new Date().toISOString().split('T')[0]
        }),
        credentials: 'include'
      });
      const data = await res.json();
      console.log('Update response:', res.status, data);

      if (data.success) {
        alert('Asesoría actualizada exitosamente');
        navigate('/maestro/asesorias');
      } else {
        setError(data.error || 'Error al actualizar');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar esta asesoría?')) return;

    try {
      const res = await fetch(`${API_URL}/segmed/advice/${asesoriaId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        alert('Asesoría eliminada');
        navigate('/maestro/asesorias');
      } else {
        setError(data.error || 'Error al eliminar');
      }
    } catch (err) {
      setError('Error al eliminar');
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

  if (!asesoriaId) {
    return (
      <div style={{ padding: '20px' }}>
        <div className="alert alert-warning">
          Selecciona una asesoría para editar.
          <Link to="/maestro/asesorias" className="btn btn-sm btn-primary ms-2">
            Ver Asesorías
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div className="card shadow-sm" style={{ maxWidth: '600px', margin: '0 auto', borderRadius: '12px' }}>
        <div className="card-header" style={{ backgroundColor: '#0c4a6e', color: 'white', borderRadius: '12px 12px 0 0' }}>
          <h4 className="mb-0">✏️ Editar Asesoría</h4>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: 'bold', color: '#0c4a6e' }}>
                Nombre de la Asesoría
              </label>
              <input
                type="text"
                className="form-control"
                name="Nombre_de_asesoria"
                value={form.Nombre_de_asesoria}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: 'bold', color: '#0c4a6e' }}>
                Fecha y Hora
              </label>
              <input
                type="datetime-local"
                className="form-control"
                name="Fecha_asesoria"
                value={form.Fecha_asesoria}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: 'bold', color: '#0c4a6e' }}>
                Estado
              </label>
              <select
                className="form-select"
                name="confirmacion"
                value={form.confirmacion}
                onChange={handleChange}
              >
                <option value="pendiente">⏳ Pendiente</option>
                <option value="confirmada">✅ Confirmada</option>
                <option value="completada">🎉 Completada</option>
                <option value="cancelada">❌ Cancelada</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: 'bold', color: '#0c4a6e' }}>
                Descripción
              </label>
              <textarea
                className="form-control"
                name="Descripcion"
                rows="4"
                value={form.Descripcion}
                onChange={handleChange}
              />
            </div>

            <div className="d-flex gap-2 mt-4">
              <button 
                type="submit" 
                className="btn"
                style={{ backgroundColor: '#1a75bc', color: 'white' }}
                disabled={saving}
              >
                {saving ? 'Guardando...' : '💾 Guardar Cambios'}
              </button>
              <Link 
                to="/maestro/asesorias" 
                className="btn btn-secondary"
              >
                Cancelar
              </Link>
              <button 
                type="button" 
                className="btn btn-danger ms-auto"
                onClick={handleDelete}
              >
                🗑️ Eliminar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AsesoriasEditar;