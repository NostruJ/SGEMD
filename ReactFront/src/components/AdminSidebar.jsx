// src/pages/Admin/AdminSidebar.jsx

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Íconos SVG para indicar el estado del submenú
const IconAngleUp = (props) => (
  <svg
    {...props}
    width="16"
    height="16"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
  >
    <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" />
  </svg>
);

const IconAngleDown = (props) => (
  <svg
    {...props}
    width="16"
    height="16"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
  >
    <path d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
  </svg>
);

const menuStructure = [
  { title: 'Perfil', items: ['Completar información personal'] },
  { title: 'Gestionar perfiles', items: ['Docentes', 'Estudiantes'] },
  { title: 'Emprendimientos', items: ['Plan de trabajo', 'Crear Emprendimiento'] },
  { title: 'Docentes', items: ['Asignar a emprendimiento', 'Seguimiento', 'Asesorias'] },
  { title: 'Eventos', items: ['Crear', 'Editar'] },
  { title: 'Diagnósticos', items: ['Gestionar'] },
];

const AdminSidebar = () => {
  const location = useLocation();
  const activePath = location.pathname;

  // Abiertos por defecto
  const [openMenus, setOpenMenus] = useState(['Perfil', 'Docentes', 'Emprendimientos']);

  const toggleMenu = (title) => {
    setOpenMenus((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const getLinkPath = (groupTitle, itemTitle) => {
    const base = groupTitle.toLowerCase().replace(/\s/g, '');
    const item = itemTitle.toLowerCase().replace(/\s/g, '');

    if (item === 'completarinformaciónpersonal') return '/admin/perfil';
    if (item === 'asignaraemprendimiento') return '/admin/docentes/asignar';
    if (item === 'docentes' && groupTitle === 'Gestionar perfiles')
      return '/admin/gestionar/docentes';
    if (item === 'estudiantes' && groupTitle === 'Gestionar perfiles')
      return '/admin/gestionar/estudiantes';
    if (item === 'plandetrabajo') return '/admin/emprendimientos/plan-de-trabajo';
    if (item === 'crearemprendimiento') return '/admin/emprendimientos/crear';
    if (item === 'crear' && groupTitle === 'Eventos') return '/admin/eventos';
    if (item === 'editar' && groupTitle === 'Eventos') return '/admin/eventos';
    if (item === 'gestionar' && groupTitle === 'Diagnósticos') return '/admin/diagnosticos';

    return `/admin/${base}/${item}`;
  };

  return (
    <aside className="admin-sidebar">
      <div className="logo-admin-area">
        <img
          // Ruta absoluta si el logo está en public/
          src="/logo.png"
          alt="Logo SGEKO Admin"
          className="logo-admin-imagen" // Nueva clase para estilizar la imagen
        />
      </div>

      <nav>
        {/* Dashboard principal */}
        <Link
          to="/admin"
          className={`admin-menu-item ${activePath === '/admin' ? 'activo-principal' : ''}`}
        >
          Dashboard
        </Link>

        {/* Grupos de menú colapsables */}
        {menuStructure.map((group) => (
          <div key={group.title}>
            <div
              className="admin-menu-group-title"
              onClick={() => toggleMenu(group.title)}
            >
              {group.title}
              {openMenus.includes(group.title) ? <IconAngleUp /> : <IconAngleDown />}
            </div>

            {/* Submenú */}
            {openMenus.includes(group.title) && (
              <div className="submenu-admin">
                {group.items.map((item) => {
                  const itemPath = getLinkPath(group.title, item);
                  return (
                    <Link
                      key={item}
                      to={itemPath}
                      className={`admin-menu-item ${activePath === itemPath ? 'activo' : ''}`}
                    >
                      {item}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
