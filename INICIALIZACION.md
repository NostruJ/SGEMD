# INICIALIZACIÓN - SGEMD

## Sistema de Gestión de Emprendimiento Minuto de Dios

---

## 1. Información del Proyecto

### 1.1 Datos Generales
- **Nombre del Proyecto:** SGEMD - Sistema de Gestión de Emprendimiento Minuto de Dios
- **Institución:** Centro Progresa UNIMINUTO (Sede Chicalá, Ibagué)
- **Versión Actual:** 1.0.0
- **Tipo:** Plataforma Web Centralizada

### 1.2 Tecnologías
| Componente | Tecnología | Puerto |
|------------|------------|--------|
| Frontend | React 18 | 3001 |
| Backend | Node.js + Express | 3005 |
| Base de Datos | MySQL (Docker) | 3306 |
| Contenedores | Docker + Docker Compose | - |

### 1.3 Paleta de Colores
| Nombre | Hexadecimal | Uso |
|--------|-------------|-----|
| Azul Oscuro | `#0c4a6e` | Títulos, Sidebar Admin |
| Azul Claro | `#1a75bc` | Botones principales, acentos |
| Amarillo | `#ffc400` | Destacados, advertencias |
| Verde | `#4CAF50` | Éxito, completado |
| Rojo | `#dc3545` | Error, vencido |
| Blanco | `#ffffff` | Fondos tarjetas |
| Gris Claro | `#f4f7f6` | Fondos contenido |

---

## 2. Estructura del Proyecto

```
Platform-SGEMD/
├── docker-compose.yml          # Orquestación de servicios
├── ERRORES.md                  # Registro de errores y soluciones
├── SPEC.md                     # Especificación técnica
├── NodeBack/                   # Backend
│   ├── src/
│   │   ├── app.js              # Servidor principal
│   │   ├── config/             # Configuración BD
│   │   ├── controllers/        # Controladores API
│   │   ├── services/           # Lógica de negocio
│   │   ├── routes/             # Rutas Express
│   │   └── middleware/         # Middleware auth
│   ├── database/               # Scripts SQL
│   └── .env                    # Variables entorno
└── ReactFront/                 # Frontend
    ├── public/
    │   └── logo.png            # Logo institucional
    └── src/
        ├── components/         # Componentes reutilizables
        ├── pages/
        │   ├── Admin/          # Módulo Administración
        │   ├── Maestro/        # Módulo Docente
        │   └── Estudiante/     # Módulo Estudiante
        ├── routes/             # Rutas React
        └── App.js              # Componente principal
```

---

## 3. Roles de Usuario

| ID | Rol | Descripción | Permisos |
|----|-----|-------------|----------|
| 1 | Administrador | Control total del sistema | Crear usuarios, emprendimientos, eventos, ver métricas, gestionar tareas |
| 2 | Estudiante | Emprendedor en formación | Ver su progreso, completar tareas, ver eventos, solo lectura |
| 3 | Maestro | Docente/a de acompañamiento | Crear tareas, registrar asesorías, seguimiento, ver todos emprendimientos |

---

## 4. Permisos por Módulo

### 4.1 Emprendimientos
| Acción | Administrador | Docente | Estudiante |
|--------|---------------|---------|-------------|
| Crear Emprendimiento | ✅ | ❌ | ❌ |
| Asignar a Estudiante | ✅ | ❌ | ❌ |
| Editar Emprendimiento | ✅ | ❌ | ❌ |
| Ver Todos | ✅ | ✅ | ❌ |
| Ver Propio | ✅ | ✅ | ✅ |

### 4.2 Tareas
| Acción | Administrador | Docente | Estudiante |
|--------|---------------|---------|-------------|
| Crear Tarea | ✅ | ✅ | ❌ |
| Editar Tarea | ✅ | ✅ | ❌ |
| Eliminar Tarea | ✅ | ✅ | ❌ |
| Completar Tarea | ❌ | ❌ | ✅ |
| Ver Tareas | ✅ | ✅ | ✅ |
| Ver Gráfico de Avance | ✅ | ✅ | ✅ |

### 4.3 Diagnóstico
| Acción | Administrador | Docente | Estudiante |
|--------|---------------|---------|-------------|
| Crear/Editar | ✅ | ❌ | ❌ |
| Ver | ✅ | ✅ | ✅ |
| Agregar Anotaciones | ✅ | ✅ | ❌ |

---

## 5. Rutas Principales

### 5.1 Frontend
| Ruta | Descripción | Rol |
|------|-------------|-----|
| `/` | Login / Registro | Público |
| `/admin` | Dashboard Admin | Administrador |
| `/admin/emprendimientos/crear` | Crear Emprendimiento | Administrador |
| `/admin/emprendimientos/ver/:id` | Ver Detalle Emprendimiento | Administrador |
| `/admin/emprendimientos/plan-de-trabajo` | Plan de Trabajo General | Administrador |
| `/admin/eventos` | Gestión de Eventos | Administrador |
| `/maestro` | Dashboard Docente | Docente |
| `/maestro/tareas` | Gestión de Tareas | Docente |
| `/maestro/emprendimientos/seguimiento` | Seguimiento | Docente |
| `/maestro/asesorias` | Registro Asesorías | Docente |
| `/estudiante` | Dashboard Estudiante | Estudiante |
| `/estudiante/emprendimiento/perfil` | Mi Emprendimiento | Estudiante |
| `/estudiante/diagnostico` | Diagnóstico | Estudiante |
| `/estudiante/recursos/docentes` | Docentes Recursos | Estudiante |
| `/estudiante/recursos/asesorias` | Asesorías Disponibles | Estudiante |
| `/estudiante/eventos` | Eventos Disponibles | Estudiante |

### 5.2 Backend (API)
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/segmed/users/register` | POST | Registrar usuario |
| `/segmed/users/login` | POST | Iniciar sesión |
| `/segmed/users/me` | GET | Usuario actual |
| `/segmed/users` | GET | Listar usuarios |
| `/segmed/users/teachers` | GET | Listar docentes |
| `/segmed/entrepreneurship` | GET/POST | Listar/Crear emprendimientos |
| `/segmed/entrepreneurship/:id` | GET/PUT | Ver/Editar emprendimiento |
| `/segmed/entrepreneurship/:id/asignar` | POST | Asignar estudiante/docente |
| `/segmed/tareas` | GET/POST | Listar/Crear tareas |
| `/segmed/tareas/mis-tareas` | GET | Tareas del estudiante |
| `/segmed/tareas/avance/usuario` | GET | % de avance |
| `/segmed/tareas/avance/emprendimiento/:id` | GET | % de avance por emprendimiento |
| `/segmed/tareas/:id/completar` | PUT | Completar tarea |
| `/segmed/tareas/vencidas` | GET | Tareas vencidas |
| `/segmed/tracing` | GET/POST | Listar/Crear seguimientos |
| `/segmed/tracing/emprendimiento/:id` | GET | Seguimientos por emprendimiento |
| `/segmed/event` | GET/POST | Listar/Crear eventos |
| `/segmed/advice` | GET/POST | Listar/Crear asesorías |
| `/segmed/diagnosis` | GET/POST | Listar/Crear diagnósticos |
| `/segmed/diagnosis/me` | GET | Mi diagnóstico |
| `/segmed/assignments` | GET/POST | Asignaciones docente-estudiante |

---

## 6. Inicialización del Proyecto

### 6.1 Requisitos Previos
- Docker Desktop instalado y corriendo
- Puerto 3306, 3005, 3001 disponibles

### 6.2 Comandos de Inicialización

```bash
# En el directorio Platform-SGEMD
cd C:/Users/ASUS/Documents/SGEMDMAIN/Platform-SGEMD

# Iniciar todos los servicios
docker compose up -d --build

# Ver estado de contenedores
docker compose ps

# Ver logs
docker compose logs -f

# Detener servicios
docker compose down
```

### 6.3 Servicios Levantados
| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| sgemd-db | 3306 | MySQL 8.0 |
| sgemd-backend | 3005 | Node.js API |
| sgemd-frontend | 3001 | React App |

### 6.4 Acceso a la Aplicación
- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3005/segmed

### 6.5 Credenciales de Prueba
- **Admin:** admin@sgemd.com / admin123
- **Estudiante:** Debe ser creado por el admin
- **Docente:** Debe ser creado por el admin

---

## 7. Base de Datos

### 7.1 Tablas Principales
- `usuarios` - Usuarios del sistema
- `roles` - Roles (Administrador, Estudiante, Maestro)
- `emprendimiento` - Emprendimientos registrados
- `tareas` - Tareas con fecha límite
- `diagnosticos` - Diagnósticos de emprendimientos
- `diagnostico_notas` - Anotaciones al diagnóstico
- `emprendimiento_usuarios` - Asignaciones
- `seguimientos` - Historial de seguimiento
- `asesorias` - Registro de asesorías
- `eventos` - Eventos del sistema

### 7.2 Tablas de Catálogo
- `roles`, `tipodocumentos`, `programaacademico`, `centrouniversitarios`
- `tipousuarios`, `tipopoblacion`, `sectoreconomico`, `modalidad`
- `etapaemprendimiento`, `tipo_evento`, `municipios`

---

## 8. Errores Comunes y Soluciones

### 8.1 Errores de Inicialización
| Error | Solución |
|-------|----------|
| Puerto en uso | Detener servicios en el puerto o cambiar docker-compose.yml |
| No conecta a BD | Verificar que sgemd-db esté corriendo |
| CORS bloquea peticiones | Verificar allowedOrigins en app.js |

### 8.2 Errores de Autenticación
| Error | Solución |
|-------|----------|
| JWT inválido | Verificar JWT_SECRET en .env |
| Token expirado | Cerrar sesión y volver a iniciar |
| Usuario no encontrado | Verificar que existe en BD |

### 8.3 Errores de Funcionalidad
| Error | Solución |
|-------|----------|
| 404 en eventos | Usar `/segmed/event` (sin 's') |
| Estudiante puede crear | Verificar permisos en frontend |
| Tareas no aparecen | Verificar tabla tareas en BD |

### 8.4 Errores Recientes (2026-04-02)
| # | Error | Solución |
|---|-------|----------|
| 29 | Estudiante puede crear emprendimientos | Modificar frontend a solo lectura |
| 30 | Falta sistema de tareas | Crear tabla + backend + frontend completo |
| 31 | No hay link hacia Ver Detalle | Agregar columna con Link en AdminPlanTrabajo.jsx |
| 32 | Crear evento dice "ruta no encontrada" | Cambiar `/segmed/events` → `/segmed/event` |
| 33 | Sidebar Admin "Ver Detalle" sin :id | Eliminar opción del menú (accesible desde Plan de Trabajo) |
| 34 | AdminAsignar placeholder sin funcionalidad | Redireccionar a AdminDocentes.jsx |
| 35 | Progreso.jsx estudiante placeholder | Implementar vista completa con gráfico de avance |
| 36 | Seguimientos docente se guardan local | Guardar en BD con nuevo endpoint tracing |
| 37 | Tarjetas de docente se desbordan | Agregar overflow:hidden y word-wrap en DocentesRecursos.jsx |
| 38 | Botón solicitar asesoría no funciona | Implementar formulario en AsesoriasRecursos.jsx con POST a /segmed/advice |
| 39 | Error FK fecha_y_Horarios | Agregar registro en tabla fecha_y_Horarios con ID 1 |
| 40 | Error bind parameters undefined | Enviar Comentarios: '' en lugar de undefined |
| 41 | docente no puede gestionar asesorias | Cambiar endpoint /segmed/assistance a /segmed/advice en Asesorias.jsx |
| 42 | Gestionar dropdown no funciona | Implementar dropdown manual con estado en Asesorias.jsx |
| 43 | Bind parameters undefined al cambiar estado | Backend: modificar update() para aceptar campos parciales |
| 44 | Descripción larga incomoda vista | Agregar modal de detalles y "Ver más" en Asesorias.jsx |
| 45 | Error bind parameters UPDATE advice | Modificar advice.service.js para actualizaciones parciales |

---

## 9. Mantenimiento y Actualización

### 9.1 Actualizar el Proyecto
```bash
# Detener servicios
docker compose down

# Actualizar código (git pull o手动)

# Reconstruir contenedores
docker compose up -d --build
```

### 9.2 Verificar Funcionamiento
Después de cada actualización, verificar:
1. Login funciona
2. Rutas según rol funcionan
3. Crear/Editar operaciones funcionan
4. Gráficos de avance se muestran

### 9.3 Actualizar Documentación
Cuando se hagan grandes cambios al sistema, actualizar ambos documentos:

**ERRORES.md:**
- Cada nuevo error encontrado y su solución
- Incluir: descripción, causa, solución, archivos modificados, fecha

**INICIALIZACION.md:**
- Nuevas rutas agregadas (sección 5)
- Nuevos endpoints API (sección 5)
- Nuevos permisos o cambios en roles (sección 4)
- Nuevas tablas en BD (sección 7)
- Errores comunes actualizados (sección 8)
- Cualquier cambio en comandos de inicialización

---

## 10. Comandos Útiles

```bash
# Ver logs de un servicio específico
docker compose logs backend
docker compose logs frontend
docker compose logs db

# Reiniciar solo un servicio
docker compose restart backend

# Acceder a la base de datos
docker exec -it sgemd-db mysql -uroot -prootpassword

# Ver contenedores en ejecución
docker ps

# Ver usage de docker
docker stats
```

---

## 11. Glosario

| Término | Definición |
|---------|------------|
| SGEMD | Sistema de Gestión de Emprendimiento Minuto de Dios |
| Emprendimiento | Proyecto empresarial del estudiante |
| Tarea | Actividad asignada con fecha límite |
| Avance | Porcentaje de tareas completadas |
| Diagnóstico | Análisis inicial del emprendimiento |
| Asesoría | Sesión de acompañamiento del maestro |
| Etapa | Fase del ciclo de vida del emprendimiento |

---

## 12. Registro de Cambios

| Versión | Fecha | Descripción |
|---------|-------|-------------|
| 1.1 | 2026-04-03 | Corregido error "Bind parameters" en creación de emprendimientos. Mejoradas vistas de AdminPlanTrabajo y AdminDashboard con gráficos mejorados. |
| 1.2 | 2026-04-03 | Corregida contraseña admin (admin123). Agregada validación al crear tareas. Mejorada UI de diagnóstico estudiantil. |
| 1.3 | 2026-04-03 | Corregido problema de múltiples emprendimientos - ahora el estudiante puede ver todos sus emprendimientos asignados con selector. |
| 1.4 | 2026-04-03 | Corregida vista "Mi Progreso" para mostrar avance de todos los emprendimientos con resumen combinado. |
| 1.5 | 2026-04-03 | Corregido bug de tipos - el backend devuelve completadas como string, ahora se convierte a número. |
| 1.6 | 2026-04-03 | Agregado sistema de diagnóstico para los 3 roles: Admin (crear/editar), Maestro (ver), Estudiante (ver). |
| 1.7 | 2026-04-03 | Corregido MaestroDiagnostico para usar estructura de BD correcta (asignaciones). |
| 1.8 | 2026-04-03 | Corregido error "Bind parameters undefined" en creación de diagnóstico. Corregida estructura de tabla diagnosticos. |

*Documento actualizado: 2026-04-03*
*Versión: 1.8*
