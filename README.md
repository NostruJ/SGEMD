# SGEMD - Sistema de Gestión de Emprendimiento Minuto de Dios

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-black)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Plataforma web integral para la administración y seguimiento de proyectos de emprendimiento educativo, desarrollada para el Centro Progresa UNIMINUTO.

</div>

## 📋 Descripción del Proyecto

SGEMD es un sistema web fullstack diseñado para gestionar el ciclo completo de proyectos de emprendimiento en el ámbito educativo. La plataforma facilita la interacción entre administradores, docentes y estudiantes, proporcionando herramientas para el registro, seguimiento y evaluación de emprendimientos desde su fase inicial hasta su consolidación.

### Problema que Resuelve

- Centralización de la información de emprendimientos
- Seguimiento efectivo del progreso de proyectos
- Comunicación fluida entre mentores y emprendedores
- Gestión administrativa de eventos y asesorías
- Medición de indicadores de éxito

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Frontend | React | 19.x |
| UI Framework | Bootstrap | 5.3 |
| Gráficos | Recharts | 3.4 |
| Routing | React Router DOM | 7.9 |
| Backend | Node.js | 18.x |
| Framework | Express.js | 4.x |
| Base de Datos | MySQL | 8.0 |
| Contenedores | Docker Compose | - |
| Autenticación | JWT | - |
| Encriptación | bcrypt | - |

## 📂 Estructura del Proyecto

```
Platform-SGEMD/
├── docker-compose.yml          # Orquestación de servicios
├── NodeBack/                   # Backend API (Puerto 3005)
│   ├── src/
│   │   ├── app.js              # Servidor principal
│   │   ├── config/             # Configuración de base de datos
│   │   ├── controllers/        # Controladores de API
│   │   ├── services/           # Lógica de negocio
│   │   ├── routes/             # Rutas de Express
│   │   └── middleware/         # Autenticación JWT
│   ├── uploads/                # Archivos subidos
│   ├── database/               # Scripts SQL
│   └── .env                    # Variables de entorno
└── ReactFront/                 # Frontend React (Puerto 3001)
    ├── public/                 # Assets estáticos
    └── src/
        ├── components/         # Componentes reutilizables
        ├── pages/
        │   ├── Admin/          # Módulo de Administración
        │   ├── Maestro/       # Módulo Docente
        │   └── Estudiante/    # Módulo Estudiante
        ├── routes/            # Rutas privadas
        ├── api.js             # Configuración de API
        └── index.css          # Estilos globales
```

## 🚀 Funcionalidades

### Módulo de Administración
- Dashboard analítico con métricas en tiempo real
- Gestión completa de usuarios (CRUD)
- Registro y seguimiento de emprendimientos
- Asignación de mentores a proyectos
- Administración de eventos institucionales
- Visualización de gráficos de progreso

### Módulo Docente
- Dashboard personal de actividades
- Registro y gestión de asesorías
- Seguimiento de emprendimientos asignados
- Evaluación de habilidades empresariales
- Gestión de tareas y actividades

### Módulo Estudiante
- Dashboard personalizado
- Gestión del perfil de emprendimiento
- Seguimiento de progreso y tareas
- Solicitud de tutorías
- Registro y confirmación de eventos

## 📦 Instalación

### Prerrequisitos

- Docker Desktop 20.10+ instalado y en ejecución
- Puertos disponibles: 3306 (MySQL), 3001 (Frontend), 3005 (Backend)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd Platform-SGEMD
   ```

2. **Iniciar servicios con Docker**
   ```bash
   docker compose up -d --build
   ```

3. **Verificar servicios**
   ```bash
   docker compose ps
   ```

### Acceso a la Aplicación

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:3005/segmed |

### Credenciales de Prueba

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | admin@sgemd.com | admin123 |

> **Nota:** Las cuentas de docente y estudiante deben ser creadas por un administrador desde el panel de gestión.

## 🔌 API Reference

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/segmed/users/register` | Registro de nuevo usuario |
| POST | `/segmed/users/login` | Inicio de sesión |
| GET | `/segmed/users/me` | Obtener usuario actual |

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/segmed/users` | Listar todos los usuarios |
| GET | `/segmed/users/:id` | Obtener usuario por ID |
| PUT | `/segmed/users/:id` | Actualizar usuario |
| GET | `/segmed/users/teachers` | Listar docentes |

### Emprendimientos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/segmed/entrepreneurship` | Listar emprendimientos |
| POST | `/segmed/entrepreneurship` | Crear emprendimiento |
| GET | `/segmed/entrepreneurship/:id` | Ver detalle |
| PUT | `/segmed/entrepreneurship/:id` | Actualizar |
| POST | `/segmed/entrepreneurship/:id/asignar` | Asignar participantes |

### Tareas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/segmed/tareas` | Listar tareas |
| POST | `/segmed/tareas` | Crear tarea |
| GET | `/segmed/tareas/mis-tareas` | Tareas del usuario |
| PUT | `/segmed/tareas/:id/completar` | Completar tarea |
| GET | `/segmed/tareas/avance/usuario` | Porcentaje de avance |

### Seguimientos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/segmed/tracing` | Listar seguimientos |
| POST | `/segmed/tracing` | Crear seguimiento |
| GET | `/segmed/tracing/emprendimiento/:id` | Por emprendimiento |

### Asesorías

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/segmed/advice` | Listar asesorías |
| POST | `/segmed/advice` | Crear asesoría |
| PUT | `/segmed/advice/:id` | Actualizar asesoría |
| DELETE | `/segmed/advice/:id` | Cancelar asesoría |

### Eventos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/segmed/event` | Listar eventos |
| POST | `/segmed/event` | Crear evento |
| PUT | `/segmed/event/:id` | Actualizar evento |
| POST | `/segmed/event/:id/assist` | Confirmar asistencia |

### Diagnósticos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/segmed/diagnosis` | Listar diagnósticos |
| POST | `/segmed/diagnosis` | Crear diagnóstico |
| GET | `/segmed/diagnosis/me` | Mi diagnóstico |

## 🤝 Contribución

Las contribuciones son bienvenidas. Para cambios importantes, por favor abra un issue primero para discutir lo que gustaría cambiar.

1. Fork el proyecto
2. Cree su rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit sus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abra un Pull Request

## ✒️ Autores

- Juan Pablo Angel Quitian
- Johan Steven Lopez Ordóñez
- Joel Sebastian Bueno Medina
- Juan Sebastian Rueda Ortiz
- Jairo Esteban Salgado Tinoco

---

<div align="center">

⌨️ Desarrollado con ❤️ para la comunidad educativa UNIMINUTO

</div>
