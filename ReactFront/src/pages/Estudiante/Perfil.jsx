import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserMenu from '../../components/UserMenu';
import AccountDeactivated from '../../components/AccountDeactivated';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

// Utilidad para obtener el token y preparar headers
const getAuthHeaders = (includeContentType = true) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔐 Token en localStorage:', token ? '✓ Presente' : '✗ Ausente');
    
    if (!token) {
      setError('No hay sesión activa. Por favor inicia sesión.');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
      return;
    }
    
    const headers = getAuthHeaders(false);
    console.log('📤 Headers a enviar:', {
      'Authorization': headers['Authorization'] ? '✓ Presente' : '✗ Ausente',
      'Authorization Value': headers['Authorization']
    });
    
    console.log('🔹 Iniciando GET /segmed/users/me...');
    
    fetch(`${API_URL}/segmed/users/me`, {
      method: 'GET',
      headers: headers,
      credentials: 'include'
    })
      .then((r) => {
        console.log('📨 Respuesta recibida - Status:', r.status, r.statusText);
        return r.json();
      })
      .then((j) => {
        console.log('✅ JSON parseado:', j);
        if (!j.success) {
          console.error('❌ Error en respuesta:', j.error);
          setError(j.error || 'Token inválido o sesión expirada');
          setUser(null);
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
          return;
        }
        const u = j.data || j;
        console.log('✅ Usuario cargado:', { id: u.idUsuarios, nombre: u.Nombre });
        setUser(u);
        setForm({
          Nombre: u.Nombre || '',
          Direccion: u.Direccion || '',
          Telefono: u.Telefono || '',
          Genero: u.Genero || '',
          EstadoCivil: u.EstadoCivil || '',
          Modalidad: u.Modalidad || '',
          Semestre: u.Semestre || '',
          FechaNacimiento: u.FechaNacimiento ? u.FechaNacimiento.slice(0,10) : '',
        });
      }).catch((err) => { 
        console.error('❌ Error en fetch /me:', err);
        setError('No se pudo conectar al servidor'); 
      });
  }, []);

  const handleEdit = () => { setEditMode(true); setSuccess(''); setError(''); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    setError(''); setSuccess('');
    try {
      const res = await fetch(`${API_URL}/segmed/users/${user.idUsuarios}`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        credentials: 'include',
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (json.success) {
        setSuccess('Perfil actualizado correctamente');
        setEditMode(false);
        fetch(`${API_URL}/segmed/users/me`, {
          method: 'GET',
          headers: getAuthHeaders(false),
          credentials: 'include'
        })
          .then((r) => r.json())
          .then((j) => setUser(j.data || j));
      } else setError(json.error || 'Error');
    } catch (err) { setError('Error de red'); }
  };

  const handleUploadAvatar = async () => {
    setError(''); setSuccess('');
    if (!avatarFile) return setError('Selecciona un archivo');
    const fd = new FormData();
    fd.append('avatar', avatarFile);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/segmed/users/${user.idUsuarios}/avatar`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      const json = await res.json();
      if (json.success) {
        setSuccess('Avatar actualizado correctamente');
        setUser({ ...user, img_perfil: json.img_perfil });
      } else setError(json.error || 'Error');
    } catch (err) { setError('Error subiendo avatar'); }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción desactivará tu cuenta y necesitarás solicitar su reactivación.')) return;
    
    setError(''); setSuccess('');
    try {
      const res = await fetch(`${API_URL}/segmed/users/${user.idUsuarios}`, {
        method: 'DELETE',
        headers: getAuthHeaders(true),
        credentials: 'include'
      });
      const j = await res.json();
      if (j.success) {
        setSuccess('✅ Cuenta desactivada correctamente. Cerrando sesión...');
        localStorage.removeItem('token');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setError(j.error || 'Error al desactivar la cuenta');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    }
  };

  if (error) return (
    <div className="container mt-5">
      <UserMenu user={user} onLogout={() => { localStorage.removeItem('token'); window.location.href = '/'; }} />
      <div className="alert alert-danger">{error}</div>
    </div>
  );
  
  if (user && user.Estado === 0) {
    return <AccountDeactivated user={user} />;
  }
  
  if (!user) return <div className="container mt-5">Cargando perfil...</div>;

  return (
    <div className="container mt-5 position-relative">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Mi Perfil de Estudiante</h3>
            </div>
            <div className="card-body">
              {success && <div className="alert alert-success">{success}</div>}
              <div className="row">
                <div className="col-md-4 text-center">
                  {user.img_perfil ? (
                    <img src={`${API_URL}${user.img_perfil}`} alt="avatar" className="rounded-circle mb-2" width={120} height={120} style={{objectFit:'cover'}} />
                  ) : (
                    <div className="rounded-circle bg-light mb-2" style={{ width: 120, height: 120, display: 'inline-block' }} />
                  )}
                  <div className="mb-3">
                    <input type="file" className="form-control" onChange={(e) => setAvatarFile(e.target.files[0])} />
                    <button className="btn btn-outline-primary btn-sm mt-2" onClick={handleUploadAvatar}>Subir avatar</button>
                  </div>
                </div>
                <div className="col-md-8">
                  {!editMode ? (
                    <>
                      <table className="table table-borderless mb-0">
                        <tbody>
                          <tr><th>Nombre</th><td>{user.Nombre || <span className="text-muted">Sin completar</span>}</td></tr>
                          <tr><th>Dirección</th><td>{user.Direccion || <span className="text-muted">Sin completar</span>}</td></tr>
                          <tr><th>Teléfono</th><td>{user.Telefono || <span className="text-muted">Sin completar</span>}</td></tr>
                          <tr><th>Género</th><td>{user.Genero || <span className="text-muted">Sin completar</span>}</td></tr>
                          <tr><th>Estado civil</th><td>{user.EstadoCivil || <span className="text-muted">Sin completar</span>}</td></tr>
                          <tr><th>Modalidad</th><td>{user.Modalidad || <span className="text-muted">Sin completar</span>}</td></tr>
                          <tr><th>Semestre</th><td>{user.Semestre || <span className="text-muted">Sin completar</span>}</td></tr>
                          <tr><th>Fecha de cumpleaños</th><td>{user.FechaNacimiento ? user.FechaNacimiento.slice(0,10) : <span className="text-muted">Sin completar</span>}</td></tr>
                          <tr><th>Última actualización</th><td>{user.FechaActualizacion ? new Date(user.FechaActualizacion).toLocaleString() : 'N/A'}</td></tr>
                        </tbody>
                      </table>
                      <div className="mt-3">
                        <button className="btn btn-primary" onClick={handleEdit}>Editar perfil</button>
                        <button className="btn btn-outline-danger ms-2" onClick={handleDeleteAccount}>Eliminar cuenta</button>
                      </div>
                    </>
                  ) : (
                    <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                      <div className="row g-2">
                        <div className="col-md-6">
                          <label className="form-label">Nombre</label>
                          <input name="Nombre" className="form-control" value={form.Nombre} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Dirección</label>
                          <input name="Direccion" className="form-control" value={form.Direccion} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Teléfono</label>
                          <input name="Telefono" className="form-control" value={form.Telefono} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Género</label>
                          <select name="Genero" className="form-select" value={form.Genero} onChange={handleChange}>
                            <option value="">Selecciona</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="No binario">No binario</option>
                            <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                            <option value="Otro">Otro</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Estado civil</label>
                          <input name="EstadoCivil" className="form-control" value={form.EstadoCivil} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Modalidad</label>
                          <input name="Modalidad" className="form-control" value={form.Modalidad} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Semestre</label>
                          <input name="Semestre" className="form-control" value={form.Semestre} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Fecha de cumpleaños</label>
                          <input name="FechaNacimiento" type="date" className="form-control" value={form.FechaNacimiento} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="mt-3">
                        <button type="submit" className="btn btn-success">Guardar cambios</button>
                        <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditMode(false)}>Cancelar</button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;