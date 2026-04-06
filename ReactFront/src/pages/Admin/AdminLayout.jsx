// src/pages/Admin/AdminLayout.jsx (Versión Mejorada y Accesible)
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import UserMenu from "../../components/UserMenu";

import "./Admin.css";

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

function AdminLayout() {
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

  return (
    <div className="admin-layout position-relative">
      <UserMenu user={user} onLogout={() => { window.location.href = '/'; }} />
      <AdminSidebar />

      <div className="admin-main-content">
        <header className="admin-header">
          <span className="header-iconos" title="Configuración">⚙️</span>
          <span className="header-iconos" title="Información">ℹ️</span>
          <span className="header-iconos" title="Notificaciones">🔔</span>
        </header>

        <div className="admin-area-contenido">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
