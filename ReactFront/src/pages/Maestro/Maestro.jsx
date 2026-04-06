// src/pages/Maestro/Maestro.jsx

import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarMaestro from '../../components/SidebarMaestro';
import UserMenu from '../../components/UserMenu';
import './Maestro.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005';

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

const Maestro = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    fetch(`${API_URL}/segmed/users/me`, {
      method: 'GET',
      headers: getAuthHeaders(false),
      credentials: 'include'
    })
      .then(r => r.json())
      .then(j => setUser(j.data || j));
  }, []);
  const getPageTitle = () => {
    if (location.pathname.includes('/perfil')) return 'Mi Perfil';
    if (location.pathname.includes('/asesorias/crear')) return 'Crear Nueva Asesoría';
    if (location.pathname.includes('/asesorias')) return 'Mis Asesorías';
    return 'Dashboard Principal';
  };
  return (
    <div className="contenedor-maestro position-relative">
      <UserMenu user={user} onLogout={() => { window.location.href = '/'; }} />
      <SidebarMaestro />
      <main className="contenido-principal">
        <header className="header-superior">
          <h2>{getPageTitle()}</h2>
        </header>
        <div className="area-contenido">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Maestro;
