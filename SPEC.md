# SGEMD - Sistema de Gestión de Emprendimiento Minuto de Dios

## 1. Información General del Proyecto

### 1.1 Identificación del Sistema
- **Nombre:** SGEMD - Sistema de Gestión de Emprendimiento Minuto de Dios
- **Institución:** Centro Progresa UNIMINUTO (Sede Chicalá, Ibagué)
- **Versión:** 1.0.0
- **Tipo:** Plataforma Web Centralizada
- ** Tecnología Frontend:** React 19
- **Tecnología Backend:** Node.js + Express
- **Base de Datos:** MySQL

### 1.2 Paleta de Colores (NO MODIFICAR)
| Nombre | Hexadecimal | Uso |
|--------|-------------|-----|
| Azul Primario | `#0057a4` | Botones, tabs activos |
| Azul Oscuro Sidebar | `#0c4a6e` | Fondo sidebar admin |
| Azul Claro Header | `#1a75bc` | Cabeceras, logos |
| Azul Sidebar Estudiante | `#003366` | Fondo sidebar estudiante |
| Amarillo UNIMINUTO | `#ffc400` | Detalles, íconos |
| Verde Éxito | `#4CAF50` | Estados positivos |
| Blanco | `#ffffff` | Fondos tarjetas |
| Gris Claro | `#f4f4f4` | Fondos contenido |

### 1.3 Logo
- **Ubicación:** `ReactFront/public/logo.png`
- **No mover ni renombrar**

---

## 2. Arquitectura del Sistema

### 2.1 Estructura de Archivos
```
Platform-SGEMD/
├── NodeBack/                    # Backend (Puerto 3005)
│   ├── src/
│   │   ├── app.js              # Servidor principal
│   │   ├── config/             # Configuración BD
│   │   ├── controllers/        # Controladores API
│   │   ├── services/           # Lógica de negocio
│   │   ├── routes/             # Rutas Express
│   │   └── middleware/         # Middleware auth
│   ├── uploads/                 # Archivos subidos
│   ├── database/               # Scripts BD
│   └── .env                    # Variables entorno
│
├── ReactFront/                  # Frontend (Puerto 3000)
│   ├── public/
│   │   ├── logo.png            # Logo institucional
│   │   ├── logo192.png
│   │   └── logo512.png
│   └── src/
│       ├── components/         # Componentes reutilizables
│       ├── pages/
│       │   ├── Admin/          # Módulo Administración
│       │   ├── Maestro/        # Módulo Docente
│       │   └── Estudiante/     # Módulo Estudiante
│       ├── routes/             # Rutas React
│       ├── api.js              # Configuración API
│       └── index.css           # Estilos globales
```

### 2.2 Roles de Usuario
| ID | Rol | Descripción |
|----|-----|-------------|
| 1 | Administrador | Control total, métricas, asignaciones |
| 2 | Estudiante | Autogestión, seguimiento entrepreneurship |
| 3 | Maestro | Registro asesorías, evaluación habilidades |

---

## 3. Requerimientos Funcionales

### 3.1 Módulo Administración

#### 3.1.1 Dashboard Analítico
- **Descripción:** Panel con métricas en tiempo real
- **Componentes requeridos:**
  - Tarjetas de métricas: Total emprendedores, Asesorías activas, Eventos programados
  - Gráfico de barras: Distribución por etapa de emprendimiento
  - Gráfico dona: Estados de proyectos
  - Tabla de últimos emprendimientos registrados

#### 3.1.2 Gestión de Usuarios
- **Descripción:** CRUD completo de usuarios
- **Funcionalidades:**
  - Listar usuarios con filtros (rol, estado, programa académico)
  - Crear nuevo usuario (estudiante/maestro/admin)
  - Editar información personal
  - Activar/desactivar cuenta
  - Restablecer contraseña
  - Asignar programa académico

#### 3.1.3 Asignación Estratégica
- **Descripción:** Asignar mentores a emprendimientos
- **Funcionalidades:**
  - Listar emprendimientos sin mentor asignado
  - Listar mentores disponibles
  - Asignar mentor a emprendimiento
  - Historial de asignaciones
  - Reasignar mentor

#### 3.1.4 Gestión de Emprendimientos
- **Descripción:** Seguimiento de proyectos empresariales
- **Etapas del ciclo de vida:**
  1. Ideación
  2. Prototipado
  3. Validación
  4. Lanzamiento
- **Funcionalidades:**
  - Registrar nuevo emprendimiento
  - Actualizar etapa
  - Documentar progreso
  - Historial de cambios (trazabilidad)

#### 3.1.5 Gestión de Eventos
- **Descripción:** Admin eventos institucionales
- **Funcionalidades:**
  - Crear evento (nombre, fecha, lugar, descripción)
  - Editar evento
  - Eliminar evento
  - Ver lista de asistentes
  - Confirmar/desconfirmar asistencia estudiante

### 3.2 Módulo Acompañamiento Docente

#### 3.2.1 Dashboard Maestro
- **Descripción:** Resumen de actividades
- **Componentes:**
  - Mis asesorías próximas
  - Proyectos a mi cargo
  - Métricas personales (estudiantes atendidos, asesorías realizadas)

#### 3.2.2 Registro de Asesorías
- **Descripción:** Documentación detallada de cada asesoría
- **Campos requeridos:**
  - Estudiante atendido
  - Fecha y hora
  - Tema / Área de asesoría
  - Descripción de lo tratado
  - Recomendaciones
  - Estado (pendiente/completada/cancelada)
- **Funcionalidades:**
  - Crear asesoría
  - Editar asesoría
  - Cancelar asesoría
  - Ver historial de asesorías por estudiante

#### 3.2.3 Evaluación de Habilidades
- **Descripción:** Evaluación cualitativa del emprendedor
- **Habilidades a evaluar:**
  - Modelado de negocios
  - Pensamiento creativo
  - Gestión de recursos
  - Capacidad de ejecución
  - Comunicación empresarial
- **Escala:** 1-5 puntos

#### 3.2.4 Seguimiento a Emprendimientos
- **Descripción:** Ver estado de emprendimientos asignados
- **Información:**
  - Nombre del emprendimiento
  - Estudiante(s) responsable(s)
  - Etapa actual
  - Historial de asesorías
  - Avance general (%)

### 3.3 Módulo Autogestión Estudiantil

#### 3.3.1 Dashboard Estudiante
- **Descripción:** Panel personal del emprendedor
- **Componentes:**
  - Mi emprendimiento (nombre, etapa, progreso)
  - Próximas asesorías programadas
  - Eventos próximos
  - Línea de tiempo del proyecto

#### 3.3.2 Gestión de Mi Emprendimiento
- **Descripción:** Información del proyecto empresarial
- **Campos:**
  - Nombre del emprendimiento
  - Descripción
  - Sector económico
  - Modelo de negocio
  - Etapa actual
  - Fecha de inicio
  - Documentos adjuntos (opcional)
- **Funcionalidades:**
  - Actualizar información
  - Documentar avances
  - Ver historial de cambios

#### 3.3.3 Solicitud de Tutorías
- **Descripción:** Solicitar asesoría al docente
- **Campos:**
  - Tema/Motivo de tutoría
  - Descripción breve
  - Fecha preferida
  - Modalidad (presencial/virtual)
- **Estados:** Pendiente, Aprobada, Reprogramada, Completada

#### 3.3.4 Eventos
- **Descripción:** Vista de eventos disponibles
- **Funcionalidades:**
  - Listar eventos upcoming
  - Ver detalles del evento
  - Confirmar asistencia
  - Cancelar asistencia
  - Ver mis eventos confirmados

#### 3.3.5 Progreso y Trazabilidad
- **Descripción:** Línea de tiempo cronológica
- **Información:**
  - Fechas de asesorías recibidas
  - Evolución de etapa
  - Hitos logrados
  - Evaluación de habilidades por etapa

---

## 4. API Endpoints

### 4.1 Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/segmed/users/register` | Registrar nuevo usuario |
| POST | `/segmed/users/login` | Iniciar sesión |
| POST | `/segmed/users/verify` | Verificar cuenta con código |
| GET | `/segmed/users/me` | Obtener usuario actual |

### 4.2 Usuarios
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/segmed/users` | Listar todos los usuarios |
| GET | `/segmed/users/:id` | Obtener usuario por ID |
| PUT | `/segmed/users/:id` | Actualizar usuario |
| DELETE | `/segmed/users/:id` | Desactivar usuario |
| PUT | `/segmed/users/:id/activate` | Activar usuario |

### 4.3 Emprendimientos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/segmed/entrepreneurship` | Listar emprendimientos |
| GET | `/segmed/entrepreneurship/:id` | Obtener emprendimiento |
| POST | `/segmed/entrepreneurship` | Crear emprendimiento |
| PUT | `/segmed/entrepreneurship/:id` | Actualizar |
| PUT | `/segmed/entrepreneurship/:id/stage` | Cambiar etapa |

### 4.4 Seguimiento
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/segmed/tracing` | Listar seguimientos |
| POST | `/segmed/tracing` | Crear seguimiento |
| GET | `/segmed/tracing/entrepreneurship/:id` | Seguimientos por emprendimiento |

### 4.5 Asesorías
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/segmed/advice` | Listar asesorías |
| POST | `/segmed/advice` | Crear asesoría |
| PUT | `/segmed/advice/:id` | Actualizar asesoría |
| DELETE | `/segmed/advice/:id` | Cancelar asesoría |

### 4.6 Eventos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/segmed/event` | Listar eventos |
| POST | `/segmed/event` | Crear evento |
| PUT | `/segmed/event/:id` | Actualizar evento |
| DELETE | `/segmed/event/:id` | Eliminar evento |
| POST | `/segmed/event/:id/assist` | Confirmar asistencia |

### 4.7 Catálogos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/segmed/academic-programs` | Programas académicos |
| GET | `/segmed/uni-centers` | Centros universitarios |
| GET | `/segmed/municipalities` | Municipios |
| GET | `/segmed/entrep-stage` | Etapas de emprendimiento |
| GET | `/segmed/type-pop` | Tipos de población |
| GET | `/segmed/econo-sector` | Sectores económicos |

---

## 5. Base de Datos

### 5.1 Esquema Principal (Ya configurado)
- Tablas de usuarios, roles, programas académicos
- Tablas de emprendimientos, seguimientos, asesorías
- Tablas de eventos, asistencia, diagnósticos

### 5.2 Consideraciones
- Encriptación de contraseñas con bcrypt
- JWT para autenticación (expira en 24h)
- Timestamps para trazabilidad

---

## 6. Estructura de Pages por Rol

### 6.1 Admin Pages
| Componente | Ruta | Estado |
|------------|------|--------|
| Admin.jsx | `/admin` | ✅ Implementado (con gráficos) |
| AdminPerfil | `/admin/perfil` | ✅ Implementado |
| AdminUsuarios | `/admin/usuarios` | ✅ Implementado |
| GestionarUsuarios | `/admin/gestionar/*` | ✅ Implementado |
| AdminAsignar | `/admin/docentes/asignar` | ✅ Implementado |

### 6.2 Maestro Pages
| Componente | Ruta | Estado |
|------------|------|--------|
| Maestro.jsx | `/maestro` | ✅ Implementado (con estadísticas) |
| MaestroPerfil | `/maestro/perfil` | ✅ Implementado |
| MaestroAsesorias | `/maestro/asesorias` | ✅ Implementado |
| MaestroAsesoriasCrear | `/maestro/asesorias/crear` | ✅ Implementado |

### 6.3 Estudiante Pages
| Componente | Ruta | Estado |
|------------|------|--------|
| EstudianteDashboard | `/estudiante` | ✅ Implementado (con gráfico de avance) |
| EstudiantePerfil | `/estudiante/perfil` | ✅ Implementado |
| EstudianteProgreso | `/estudiante/progreso` | ✅ Implementado |

---

## 7. Pendientes de Implementación

### 7.1 Alta Prioridad
- [x] Dashboard Admin con métricas visuales (gráficos) - Implementado con Recharts
- [x] Dashboard Maestro con resumen de actividades - Implementado
- [x] Dashboard Estudiante con línea de tiempo - Implementado con gráfico de avance
- [x] CRUD completo de emprendimientos - Implementado
- [x] Sistema de asignación maestro-emprendimiento - Implementado
- [x] Gestión de eventos con asistencia - Implementado

### 7.2 Media Prioridad
- [x] Evaluación de habilidades empresariales - Ver diagnóstico
- [x] Solicitud de tutorías estudiante - Implementado en DocentesRecursos
- [x] Historial de trazabilidad - Implementado (seguimientos)
- [ ] Exportación de reportes

### 7.3 Baja Prioridad
- [ ] Notificaciones por email - Pendiente
- [ ] Dashboard analytics avanzado
- [ ] Adjuntar documentos a emprendimientos

---

## 8. Deployment

### 8.1 Variables de Entorno (Backend)
```env
PORT=3005
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_sgmed
JWT_SECRET=<secret>
JWT_EXPIRES_IN=24h
EMAIL_SERVICE=gmail
EMAIL_PORT=587
EMAIL_USER=sgemd22@gmail.com
EMAIL_PASS=<app-password>
```

### 8.2 Ejecución Local
```bash
# Backend
cd NodeBack
npm start

# Frontend
cd ReactFront
npm start
```

### 8.3 Docker (IMPLEMENTADO)

#### Estructura de archivos Docker
```
Platform-SGEMD/
├── docker-compose.yml      # Orquestación completa
├── NodeBack/
│   └── Dockerfile         # Imagen del backend
└── ReactFront/
    └── Dockerfile         # Imagen del frontend
```

#### docker-compose.yml
```yaml
# Servicios configurados:
# - db: MySQL 8.0 (puerto 3306)
# - backend: Node.js Express (puerto 3005)
# - frontend: React (puerto 3000)
```

#### Ejecución con Docker
```bash
# En el directorio Platform-SGEMD
cd Platform-SGEMD

# Iniciar todos los servicios
docker-compose up --build

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

#### Acceso a la aplicación
- Frontend: http://localhost:3000
- Backend API: http://localhost:3005/segmed

#### Credenciales por defecto (después de ejecutar scripts BD)
- Admin: admin@sgemd.com / admin123
- Estudiante: Crear cuenta desde el registro
- Maestro: Crear cuenta desde el registro

---

## 9. Validación UAT

### 9.1 Casos de Prueba - Administrador
- [ ] Iniciar sesión como admin
- [ ] Ver dashboard con métricas
- [ ] Crear nuevo usuario estudiante
- [ ] Asignar mentor a emprendimiento
- [ ] Crear nuevo evento
- [ ] Ver lista de usuarios activos

### 9.2 Casos de Prueba - Maestro
- [ ] Iniciar sesión como maestro
- [ ] Ver dashboard personal
- [ ] Crear nueva asesoría
- [ ] Evaluar habilidades de estudiante
- [ ] Ver emprendimientos asignados
- [ ] Actualizar estado de asesoría

### 9.3 Casos de Prueba - Estudiante
- [ ] Registrarse y verificar email
- [ ] Iniciar sesión
- [ ] Completar perfil de emprendimiento
- [ ] Solicitar tutoría
- [ ] Ver eventos y confirmar asistencia
- [ ] Ver progreso y trazabilidad

---

## 10. Glosario

| Término | Definición |
|---------|------------|
| SGEMD | Sistema de Gestión de Emprendimiento Minuto de Dios |
| UNIMINOTO | Universidad Minuto de Dios |
| Emprendimiento | Proyecto empresarial del estudiante |
| Asesoría | Sesión de acompañamiento del maestro |
| Etapa | Fase del ciclo de vida del emprendimiento |
| Trazabilidad | Historial de cambios y avances |

---

*Documento generado para completar la implementación del SGEMD*
*Versión: 1.0 | Fecha: Marzo 2026*

---

## 11. Actualizaciones Recientes (2026-04-03)

### Cambios implementados:
- ✅ Corregido sistema de creación de emprendimientos (error "Bind parameters")
- ✅ Mejorados gráficos del Dashboard Admin (BarChart, PieChart, RadialBar)
- ✅ Mejorada vista de Plan de Trabajo con gráficos visuales
- ✅ Agregada sanitización de datos en controllers
- ✅ Documentados errores #47-#51 en ERRORES.md

### Archivos principales modificados:
- `NodeBack/src/app.js` - Limpieza de middleware
- `NodeBack/src/controllers/entrepreneurship.controller.js` - Sanitización
- `NodeBack/src/services/entrepreneurship.service.js` - Manejo de valores
- `ReactFront/src/pages/Admin/Admin.jsx` - Gráficos mejorados
- `ReactFront/src/pages/Admin/AdminPlanTrabajo.jsx` - Gráficos mejorados
- `ReactFront/src/pages/Admin/AdminCrearEmprendimiento.jsx` - Mejor manejo de errores

*Última actualización: 2026-04-03*
