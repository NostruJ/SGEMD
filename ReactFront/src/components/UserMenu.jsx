import React, { useState } from 'react';

export default function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  if (!user) return null;
  let opciones = [];
  // Rol: 1=Admin, 2=Emprendedor/Estudiante, 3=Asesor/Maestro
  switch (user.Rol) {
    case 1:
      opciones = [
        { label: 'Panel de administración', href: '/admin' },
        { label: 'Usuarios', href: '/admin/usuarios' },
        { label: 'Configuración', href: '/admin/perfil' },
      ];
      break;
    case 2:
      opciones = [
        { label: 'Mi perfil', href: '/estudiante/perfil' },
        { label: 'Progreso', href: '/estudiante/progreso' },
        { label: 'Preferencias', href: '#' },
      ];
      break;
    case 3:
      opciones = [
        { label: 'Panel de asesor', href: '/maestro' },
        { label: 'Mi perfil', href: '/maestro/perfil' },
        { label: 'Asesorías', href: '/maestro/asesorias' },
      ];
      break;
    default:
      opciones = [
        { label: 'Perfil', href: '#' },
      ];
  }
  return (
    <div style={{ position: 'absolute', top: 20, right: 30, zIndex: 9999 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}>
      <button className="btn btn-light dropdown-toggle" type="button" style={{ position: 'relative', zIndex: 9999 }}>
        <span className="me-2">{user.Nombre || 'Usuario'}</span>
        <span className="badge bg-secondary ms-1">{user.Rol === 1 ? 'Admin' : user.Rol === 2 ? 'Emprendedor' : user.Rol === 3 ? 'Asesor' : 'Usuario'}</span>
      </button>
      <ul className={`dropdown-menu${open ? ' show' : ''}`} style={{ right: 0, left: 'auto', minWidth: 200, zIndex: 9999, position: 'relative' }}>
        {opciones.map(opt => (
          <li key={opt.label}><a className="dropdown-item" href={opt.href}>{opt.label}</a></li>
        ))}
        <li><hr className="dropdown-divider" /></li>
        <li><button className="dropdown-item text-danger" onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/';
        }}>Salir</button></li>
      </ul>
    </div>
  );
}
