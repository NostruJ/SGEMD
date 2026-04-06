// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
const API_URL = 'http://localhost:3005';

function Login({ setUsuario }) {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Permitir cuentas de prueba locales (sin llamar al backend)
    const DEMO_ACCOUNTS = {
      "admin@demo.com": { password: "admin123", rol: 1, nombre: "Admin Demo" },
      "student@demo.com": { password: "student123", rol: 2, nombre: "Student Demo" },
      "teacher@demo.com": { password: "teacher123", rol: 3, nombre: "Teacher Demo" },
    };

    const tryDemo = (email, pass) => {
      const account = DEMO_ACCOUNTS[email];
      if (account && account.password === pass) return account;
      return null;
    };

    const demo = tryDemo(correo.trim(), clave);
    if (demo) {
      // Login local: establecer token y usuario, redirigir según rol
      const rolesMap = { 1: "administrador", 2: "estudiante", 3: "maestro" };
      const rol = rolesMap[demo.rol] || "desconocido";
      localStorage.setItem("token", `demo-token-${demo.rol}`);
      if (typeof setUsuario === "function") setUsuario({ nombre: demo.nombre, rol });
      if (rol === "administrador") navigate("/admin");
      else if (rol === "maestro") navigate("/maestro");
      else if (rol === "estudiante") navigate("/estudiante");
      return;
    }

    try {
      const loginUrl = `${API_URL}/segmed/users/login`;
      console.log('🔗 URL de login:', loginUrl);
      
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          CorreoInstitucional: correo,
          Password: clave,
        }),
        mode: "cors"
      });

      console.log('📬 Respuesta del servidor:', response.status);

      const data = await response.json();

      if (response.ok && data.success) {
        // 🔹 Guardar el token en localStorage
        localStorage.setItem("token", data.data.token);

        // Validar que el rol existe y es número
        const user = data.data.user;
        if (user && (typeof user.Rol === "number" || typeof user.Roles_idRoles1 === "number")) {
          // Mapeo de rol numérico a string
          const rolesMap = { 1: "administrador", 2: "estudiante", 3: "maestro" };
          const userRol = user.Rol || user.Roles_idRoles1;
          const rol = rolesMap[userRol] || "desconocido";
          setUsuario({ nombre: user.Nombre, rol });

          // 🔹 Redirige según el rol
          if (rol === "administrador") navigate("/admin");
          else if (rol === "maestro") navigate("/maestro");
          else if (rol === "estudiante") navigate("/estudiante");
          else setMensaje("Rol desconocido.");
        } else {
          setMensaje("No se recibió un rol válido del servidor.");
          console.error("Respuesta inesperada, falta 'Rol':", data);
        }
      } else {
        // Mostrar mensaje de error devuelto por el servidor si existe
        const serverMsg = data?.message || data?.msg || data?.error;
        setMensaje(serverMsg || "Credenciales inválidas.");
        console.warn("Login falló:", data);
      }
    } catch (error) {
      console.error("❌ Error completo:", error);
      console.error("❌ Tipo de error:", error.name);
      console.error("❌ Mensaje:", error.message);
      
      let msg = error.message;
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        msg = 'No se puede conectar al servidor. Verifica que el backend esté corriendo en el puerto 3000.';
      }
      setMensaje(`Error al conectar con el servidor: ${msg}`);
    }
  };

  return (
    <div className="login-container">
      <h2>Inicio de Sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo Institucional"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
      </form>
      {/* Demo buttons removed from UI per user request. Demo accounts remain available programmatically. */}
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default Login;
