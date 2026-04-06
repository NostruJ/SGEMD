import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAsignar = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate('/admin/docentes/gestion');
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Redireccionando...</span>
      </div>
    </div>
  );
};

export default AdminAsignar;
