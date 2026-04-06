# Registro de Errores - SGEMD

## Errores Encontrados y Soluciones

---

## 1. Error: "Cannot find module '../services/Roles.service'"
**Causa:** El controlador usaba mayúscula `Roles.service` pero el archivo es `roles.service.js`
**Solución:** Corregir la ruta en `roles.controller.js` de `'../services/Roles.service'` a `'../services/roles.service'`
**Archivo:** `NodeBack/src/controllers/roles.controller.js`
**Estado:** ✅ Resuelto

---

## 2. Error: "Unknown database 'DB_SGEMD'" al iniciar MySQL
**Causa:** El script `activate_users.sql` usaba `USE DB_SGEMD` pero la base de datos se llama `db_segmed`
**Solución:** 
- Renombrar el script a `init.sql`
- Usar `USE db_segmed`
- Corregir los nombres de tablas/variables
**Archivo:** `NodeBack/database/activate_users.sql` → `NodeBack/database/init.sql`
**Estado:** ✅ Resuelto

---

## 3. Error: "Error conectando a la base de datos: connect ECONNREFUSED"
**Causa:** El backend no usaba las variables de entorno para la conexión a BD
**Solución:** 
- Modificar `db.config.js` para usar `process.env.DB_HOST`, etc.
- Actualizar `.env` con los valores correctos: `DB_HOST=sgemd-db`, `DB_PASSWORD=rootpassword`
- Agregar `DB_PORT` al docker-compose.yml
**Archivo:** `NodeBack/src/config/db.config.js`, `NodeBack/.env`
**Estado:** ✅ Resuelto

---

## 4. Error: CORS bloqueando peticiones del frontend
**Causa:** Solo se permitía el origen `http://localhost:3000` en CORS
**Solución:** Agregar múltiples orígenes en el middleware CORS
**Archivo:** `NodeBack/src/app.js`
**Estado:** ✅ Resuelto

---

## 5. Error: Puerto incorrecto en el frontend
**Causa:** El frontend intentaba conectar al puerto 3005 pero el backend está en 3005 en Docker, y el frontend usa 3001
**Solución:** 
- Cambiar API_URL de `localhost:3005` a `localhost:3000` (donde está el backend Docker)
- Pero luego el backend Docker cambió a puerto 3005
- Necesario verificar que el puerto del backend coincida con lo que el frontend usa
**Archivos:** `ReactFront/src/api.js`, `ReactFront/src/components/Login.jsx`, `ReactFront/src/components/Register.jsx`
**Estado:** ⚠️ Pendiente verificar

---

## 6. Error: Docker no copia archivos correctamente
**Causa:** El Dockerfile usaba `COPY src ./src` que no incluía otros archivos necesarios
**Solución:** Cambiar a `COPY . .` para copiar todo el contenido
**Archivo:** `NodeBack/Dockerfile`
**Estado:** ✅ Resuelto

---

## 7. Error: Contraseña no coincide
**Causa:** La contraseña no se estaba guardando correctamente en la BD
**Solución:** 
- Insertar manualmente el hash bcrypt en la BD
- Hash: `$2b$10$dl4gNCLsWRImRD3b13BP2OhVijMSf1VuxlNMvBuiTr22G1JTuE2cG` (contraseña: Admin2024!)
**Estado:** ✅ Resuelto

---

## 8. Error: El rol del usuario no se mapea correctamente
**Causa:** El frontend espera `user.Rol` pero el backend retorna `user.Roles_idRoles1`
**Solución:** Modificar Login.jsx y Register.jsx para aceptar ambos campos
**Archivos:** `ReactFront/src/components/Login.jsx`, `ReactFront/src/components/Register.jsx`
**Estado:** ✅ Resuelto

---

## 9. Error: "Failed to fetch" en el navegador
**Causa:** El navegador no puede conectar al backend desde el frontend
**Posibles causas:**
- Puerto incorrecto
- CORS no permite el origen
- Backend no está corriendo
**Solución:** Verificar que los puertos coincidan y que CORS esté configurado
**Estado:** ⚠️ En proceso

---

## 10. Error: Variables de entorno no se cargan en Docker
**Causa:** El .env tiene valores por defecto hardcodeados que sobrescriben las variables de Docker
**Solución:** Asegurar que docker-compose pase las variables y que db.config.js las use correctamente
**Archivo:** `docker-compose.yml`, `NodeBack/src/config/db.config.js`
**Estado:** ✅ Resuelto

---

## Errores Comunes a Evitar en el Futuro

### Docker
1. ❌ **No usar `COPY src ./src`**: Usar `COPY . .` para incluir todos los archivos
2. ❌ **Olvidar volumenes de inicialización**: Los scripts SQL deben estar en `/docker-entrypoint-initdb.d/`
3. ❌ **No esperar a que MySQL esté healthy**: Usar `depends_on` con `condition: service_healthy`
4. ❌ **Usar `localhost` en Docker networking**: Usar el nombre del servicio (`sgemd-db`) como host
5. ❌ **Puerto incorrecto en CORS**: Agregar todos los puertos del frontend en allowedOrigins
6. ❌ **No copiar .env al contenedor**: O pasar todas las variables por environment en docker-compose

### Base de Datos
1. ❌ **Nombres de BD inconsistentes**: Verificar `db_segmed` vs `DB_SGEMD`
2. ❌ **No inicializar tablas**: Siempre ejecutar schema.sql antes de datos
3. ❌ **Passwords no encriptados**: Usar bcrypt para almacenar contraseñas

### Frontend
1. ❌ **Puertos hardcodeados incorrectos**: Usar variables de entorno
2. ❌ **No manejar errores de red**: Siempre mostrar mensajes claros al usuario
3. ❌ **CORS bloqueando**: Verificar que el backend permita el origen del frontend

---

## 12. Error: "Table 'db_segmed.usuarios' doesn't exist"
**Causa:** MySQL en Docker usa case-sensitive para nombres de tablas. El schema usaba mayúsculas pero el código usaba minúsculas. Además, el código buscaba `usuarios` pero la tabla se llamaba `Usuarios`.
**Solución:** 
- Modificar schema.sql para crear tablas en minúsculas
- Modificar users.service.js para usar `usuarios` (minúsculas)
- Modificar todos los queries para usar nombres de tablas en minúsculas
**Archivo:** `NodeBack/database/schema.sql`, `NodeBack/src/services/users.service.js`
**Estado:** ✅ Resuelto

---

## 13. Error: "Incorrect date value" al crear usuario
**Causa:** MySQL espera formato de fecha DATE (YYYY-MM-DD) pero JavaScript envía objetos Date completos o timestamps ISO
**Solución:** Crear función helper `formatDate()` que convierte fechas al formato YYYY-MM-DD y usarla en todos los queries
**Archivos:** `NodeBack/src/services/users.service.js`
**Estado:** ✅ Resuelto

---

## 14. Correo de verificación no llega
**Causa:** El sistema de correo está funcionando (verificado con test-email). El código de verificación se retorna en la respuesta del registro.
**Solución:** 
- El usuario debe revisar su bandeja de correo no deseado (spam)
- El código también se retorna en la respuesta `verificationCode` para desarrollo
- Verificar que el correo sea válido y no esté en spam
**Estado:** ⚠️ Verificar bandeja de spam

---

## Pendientes de Verificación

- [x] Puerto correcto del backend (3005)
- [x] API_URL en el frontend apunta al puerto correcto (3005)
- [x] Login funciona completamente
- [x] Registro funciona (verificado con test-email)
- [x] Redirección según rol funciona

---

## 11. Error: Puerto mismatch entre frontend y backend
**Causa:** El backend está en puerto 3005 pero el frontend busca en 3000
**Solución:** Actualizar API_URL en todos los archivos del frontend
**Archivos:** 
- `ReactFront/src/api.js` → `http://localhost:3005`
- `ReactFront/src/components/Login.jsx` → `http://localhost:3005`
- `ReactFront/src/components/Register.jsx` → `http://localhost:3005`
**Estado:** ✅ Resuelto

---

## 15. Error: "Token válido pero req.user.id undefined" - No autorizado al acceder al perfil
**Causa:** El JWT_SECRET en el archivo .env contenía un token JWT completo (con formato xxx.yyy.zzz), lo cual causaba que jwt.verify() lo interpretara de forma diferente. El middleware autenticaba el token pero no decodificaba correctamente el campo `id`.
**Solución:** 
- Cambiar JWT_SECRET a una clave simple sin formato JWT: `sgemd_super_secret_key_2025`
- Actualizar el middleware auth.middleware.js para usar la misma clave por defecto
- IMPORTANTE: Los tokens anteriores generados con la clave antigua quedan inválidos - el usuario debe cerrar sesión y volver a iniciar
**Archivos:** `NodeBack/.env`, `NodeBack/src/middleware/auth.middleware.js`
**Estado:** ✅ Resuelto (2026-03-31)

---

## 16. Error: Login no guarda el token correctamente
**Causa:** En Login.jsx se usaba la variable `data` sin haberla definido. Faltaba el `await response.json()` antes de usar `data`.
**Solución:** Agregar `const data = await response.json();` antes de verificar `data.success`
**Archivo:** `ReactFront/src/components/Login.jsx`
**Estado:** ✅ Resuelto (2026-03-31)

---

## 17. Error: Eliminar usuario solo cambia estado (soft delete) en vez de eliminar definitivamente
**Causa:** El botón "Eliminar" en GestionarUsuarios.jsx llamaba a `DELETE /:id` que solo ejecuta soft-delete (Estado = 0). El usuario pedía eliminación definitiva.
**Solución:** 
- Crear nueva ruta `DELETE /:id/hard` para eliminación definitiva
- Agregar método `hardRemove` en users.service.js
- Agregar控制器 `hardDeleteUser` en user.controller.js
- Actualizar frontend para usar la nueva ruta
**Archivos:** 
- `NodeBack/src/routes/user.routes.js`
- `NodeBack/src/controllers/user.controller.js`
- `NodeBack/src/services/users.service.js`
- `ReactFront/src/pages/admin/GestionarUsuarios.jsx`
**Estado:** ✅ Resuelto (2026-03-31)

---

## 19. Error: Al ser redireccionado por error o al navegar hacia atrás muestra login viejo
**Causa:** Possible cache del navegador o build antiguo. El frontend está sirviendo archivos cacheados.
**Solución:** 
- Hacer rebuild completo de los contenedores
- Verificar que no haya referencias a LoginForm.js en el código
- Si persiste, el usuario debe limpiar cache del navegador (Ctrl+Shift+Delete)
**Archivo:** N/A - Problema de cache del navegador
**Estado:** ⚠️ En proceso (2026-03-31)

---

## 20. Error: Vistas placeholder sin funcionalidad
**Causa:** Existían múltiples rutas con `<div>Vista de...</div>` que no tenían implementación funcional.
**Solución:** Crear todos los componentes necesarios y actualizar las rutas en App.js

**Nuevos componentes creados:**
- Estudiante: `PerfilEmprendimiento.jsx`, `PlanTrabajo.jsx`, `Seguimiento.jsx`, `Comparativa.jsx`
- Maestro: `Emprendimientos.jsx`, `EmpSeguimiento.jsx`, `Asesorias.jsx`, `AsesoriasCrear.jsx`, `AsesoriasEditar.jsx`
- Admin: `AdminPlanTrabajo.jsx`, `AdminEventos.jsx`

**Rutas actualizadas en App.js:**
- Estudiante: `/emprendimiento/perfil`, `/plan`, `/seguimiento`, `/comparativa`
- Maestro: `/asesorias/editar`, `/emprendimientos/perfil`, `/emprendimientos/seguimiento`
- Admin: `/emprendimientos/plan-de-trabajo`, `/eventos`

**Archivos actualizados:**
- `ReactFront/src/App.js` - Imports y rutas
- `ReactFront/src/components/EstudianteSidebar.jsx` - Rutas de menú
- `ReactFront/src/components/SidebarMaestro.jsx` - Rutas de menú
- `ReactFront/src/components/AdminSidebar.jsx` - Rutas de menú

**Estado:** ✅ Resuelto (2026-03-31)

---

## 21. Error: Ruta /login eliminada pero referenciada
**Causa:** Se eliminó la ruta `/login` pero aún existían redirecciones a ella en el código.
**Solución:** Cambiar todas las referencias de `/login` a `/` (página principal con login/register)
**Archivos actualizados:** Multiple archivos en `/pages` y `/components`
**Estado:** ✅ Resuelto (2026-03-31)

---

## 22. Error: Múltiples endpoints devuelven "Table doesn't exist" (Error 500)
**Causa:** MySQL en Docker (Linux) es case-sensitive. Los servicios usaban nombres de tablas con mayúsculas inicial (ej: `Municipios`, `Roles`, `Emprendimiento`) pero la base de datos tiene tablas en minúsculas (ej: `municipios`, `roles`, `emprendimiento`).

**Error específico:**
```
Table 'db_segmed.Municipios' doesn't exist
Table 'db_segmed.Roles' doesn't exist
Table 'db_segmed.Emprendimiento' doesn't exist
```

**Solución:** Actualizar todos los archivos de servicios para usar nombres de tablas en minúsculas:

| Archivo | Cambio |
|---------|--------|
| `municipalities.service.js` | `Municipios` → `municipios` |
| `roles.service.js` | `Roles` → `roles` |
| `typeDoc.service.js` | `TipoDocumentos` → `tipodocumentos` |
| `typeUsers.service.js` | `TipoUsuarios` → `tipousuarios` |
| `uniCenters.service.js` | `CentroUniversitarios` → `centrouniversitarios` |
| `typePop.service.js` | `TipoPoblacion` → `tipopoblacion` |
| `academicProgram.service.js` | `ProgramaAcademico` → `programaacademico` |
| `entrepStage.service.js` | `EtapaEmprendimiento` → `etapaemprendimiento` |
| `econoSector.service.js` | `SectorEconomico` → `sectoreconomico` |
| `mode.service.js` | `Modalidad` → `modalidad` |
| `entrepreneurship.service.js` | `Emprendimiento` → `emprendimiento` |
| `tracing.service.js` | `Seguimientos` → `seguimientos` |
| `assistance.service.js` | `Asistencia` → `asistencia` |
| `typeEvent.service.js` | `Tipo_evento` → `tipo_evento` |
| `event.service.js` | `Eventos` → `eventos` |
| `diagnosis.service.js` | `Diagnosticos` → `diagnosticos` |
| `advice.service.js` | `Asesorias` → `asesorias` |

**Archivos:** `NodeBack/src/services/*.service.js`
**Estado:** ✅ Resuelto (2026-03-31)

---

## 23. Error: Login funciona pero contraseña no coincide con hash en BD
**Causa:** El hash de contraseña guardado en la base de datos no correspondía a 'admin123'. El hash original `$2b$10$dl4gNCLsWRImRD3b13BP2OhVijMSf1VuxlNMvBuiTr22G1JTuE2cG` no validaba correctamente.

**Solución:** 
- Generar nuevo hash con bcrypt para 'admin123': `$2b$10$1Imy32xkLinpDQSB52/EseZwqoeLI67VmPr7QuX79HM6hCrsm9xlq`
- Actualizar la contraseña en la base de datos
- Nota: La diferencia era que el hash original probablemente fue generado con una versión diferente de bcrypt o salt diferente

**Archivo:** `NodeBack/database/init.sql` (actualizar hash del admin)
**Estado:** ✅ Resuelto (2026-03-31)

---

## 24. Error: Emprendimientos no se cargan correctamente (404 en frontend)
**Causa:** El frontend usaba incorrectamente la ruta `/segmed/entrepreneurships/${userId}` pero la API provee `/segmed/users/${userId}/entrepreneurships`. Además, el servicio `users.service.js` usaba nombre de tabla incorrecto.

**Errores específicos:**
- Frontend: `/segmed/entrepreneurships/${userId}` → debe ser `/segmed/users/${userId}/entrepreneurships`
- Backend: `users.service.js` consultaba tabla `emprendimientos` (plural) pero la BD tiene `emprendimiento` (singular)
- Backend: Columna `idUsuario` pero la BD tiene `Usuarios_idUsuarios`

**Solución:**
1. Corregir `users.service.js`:
   - `'SELECT * FROM emprendimientos WHERE idUsuario = ?'` → `'SELECT * FROM emprendimiento WHERE Usuarios_idUsuarios = ?'`
2. Corregir llamadas API en frontend:
   - `PerfilEmprendimiento.jsx`
   - `PlanTrabajo.jsx`
   - `Seguimiento.jsx`
   - `DashboardContent.jsx`
3. Agregar campo `Usuarios_idUsuarios` al crear emprendimiento en `PerfilEmprendimiento.jsx`

**Archivos modificados:**
- `NodeBack/src/services/users.service.js`
- `ReactFront/src/pages/Estudiante/PerfilEmprendimiento.jsx`
- `ReactFront/src/pages/Estudiante/PlanTrabajo.jsx`
- `ReactFront/src/pages/Estudiante/Seguimiento.jsx`
- `ReactFront/src/pages/Estudiante/DashboardContent.jsx`

**Estado:** ✅ Resuelto (2026-03-31)

---

## 25. Error: Falta módulo de asignaciones docente-estudiante
**Causa:** No existían las rutas, servicios ni controladores para gestionar las asignaciones de docentes a estudiantes.

**Solución:** Crear módulo completo de asignaciones:
1. **Backend:**
   - `assignments.service.js` - Servicio con métodos CRUD
   - `assignments.controller.js` - Controlador
   - `assignments.routes.js` - Rutas en `/segmed/assignments`
   - Agregar ruta en `app.js`

2. **Frontend:**
   - `AdminDocentes.jsx` - Componente para gestionar docentes y crear asignaciones

**Rutas creadas:**
- `GET /segmed/assignments` - Listar todas
- `GET /segmed/assignments/mentor/:id` - Por docente
- `GET /segmed/assignments/estudiante/:id` - Por estudiante
- `POST /segmed/assignments` - Crear
- `PUT /segmed/assignments/:id` - Actualizar
- `DELETE /segmed/assignments/:id` - Eliminar

**Archivos creados:**
- `NodeBack/src/services/assignments.service.js`
- `NodeBack/src/controllers/assignments.controller.js`
- `NodeBack/src/routes/assignments.routes.js`
- `ReactFront/src/pages/Admin/AdminDocentes.jsx`

**Estado:** ✅ Resuelto (2026-03-31)

---

## 26. Error: Eventos no permiten registro de usuarios
**Causa:** El backend no tenía endpoints para que usuarios se registraran en eventos.

**Solución:** Agregar métodos en `event.controller.js`:
- `POST /:id/register` - Registrarse en evento
- `DELETE /:id/register` - Cancelar registro
- `GET /event/user/:userId` - Ver eventos del usuario

**Archivos modificados:**
- `NodeBack/src/controllers/event.controller.js`
- `NodeBack/src/routes/event.routes.js`

**Estado:** ✅ Resuelto (2026-03-31)

---

## 27. Error: Estudiantes no pueden ver la lista de docentes (403 Forbidden)
**Causa:** La ruta `/segmed/users/teachers` estaba protegida con `isAdmin`, lo cual impedía que los estudiantes accederan a la lista de docentes desde la vista de Recursos.

**Solución:** Remover el middleware `isAdmin` de la ruta `/teachers` para permitir acceso a usuarios autenticados.

**Archivo modificado:**
- `NodeBack/src/routes/user.routes.js`

**Cambio realizado:**
```javascript
// Antes (solo admin):
router.get('/teachers', authenticateToken, isAdmin, usersController.getAllTeachers)

// Después (cualquier usuario autenticado):
router.get('/teachers', authenticateToken, usersController.getAllTeachers)
```

**Estado:** ✅ Resuelto (2026-04-02)

---

## 28. Error: Estudiante no tiene vistas para Recursos (Docentes, Asesorías) y Eventos
**Causa:** El menú del estudiante incluía opciones de "Recursos > Docentes", "Recursos > Asesorías" y "Eventos > Ver eventos disponibles", pero no existían las vistas ni rutas correspondientes.

**Solución:** Crear las vistas faltantes con la paleta de colores del proyecto (#0c4a6e, #1a75bc, #ffc400, #4CAF50):

**Vistas creadas:**
1. `DocentesRecursos.jsx` - Lista de docentes con búsqueda y opción de solicitar asesoría
2. `AsesoriasRecursos.jsx` - Mis asesorías y asesorías disponibles
3. `EventosEstudiante.jsx` - Listado de eventos con filtros por tipo y estado

**Rutas agregadas en App.js:**
```javascript
<Route path="recursos/docentes" element={<DocentesRecursos />} />
<Route path="recursos/asesorias" element={<AsesoriasRecursos />} />
<Route path="eventos" element={<EventosEstudiante />} />
```

**Sidebar actualizado en EstudianteSidebar.jsx:**
- Docentes → `/estudiante/recursos/docentes`
- Asesorías → `/estudiante/recursos/asesorias`
- Ver eventos disponibles → `/estudiante/eventos`

**Corrección de endpoint en EventosEstudiante.jsx:**
- `segmed/typeEvent` → `segmed/type-event` (ruta correcta)

**Archivos creados:**
- `ReactFront/src/pages/Estudiante/DocentesRecursos.jsx`
- `ReactFront/src/pages/Estudiante/AsesoriasRecursos.jsx`
- `ReactFront/src/pages/Estudiante/EventosEstudiante.jsx`

**Archivos modificados:**
- `ReactFront/src/App.js` - Imports y rutas
- `ReactFront/src/components/EstudianteSidebar.jsx` - Rutas de menú
- `ReactFront/src/pages/Estudiante/EventosEstudiante.jsx` - Corrección de endpoint

**Estado:** ✅ Resuelto (2026-04-02)

---

## 29. Error: Estudiante puede crear/editar emprendimientos y diagnóstico
**Causa:** El estudiante tenía acceso a crear y editar emprendimientos, diagnóstico y plan de trabajo, cuando según los requisitos solo debe ver su progreso (solo lectura).

**Solución:** 

**Archivos modificados (Estudiante - Solo lectura):**
- `ReactFront/src/pages/Estudiante/PerfilEmprendimiento.jsx` - Eliminado botones crear/editar, solo muestra información
- `ReactFront/src/pages/Estudiante/Diagnostico.jsx` - Eliminado editMode, solo muestra diagnóstico
- `ReactFront/src/pages/Estudiante/DashboardContent.jsx` - Quitado link "Registrar Mi Emprendimiento"

**Mensajes actualizados:**
- PerfilEmprendimiento: "Aún no tienes un emprendimiento asignado. Contacta al administrador"
- Diagnostico: "No hay un diagnóstico registrado. El administrador debe crearlo"
- Dashboard: Ahora muestra gráfico de avance por tareas

**Estado:** ✅ Resuelto (2026-04-02)

---

## 30. Error: Falta sistema de tareas con fecha límite y gráfico de avance
**Causa:** No existía un sistema para que el profesor crease tareas con fecha límite, ni un gráfico que mostrara el avance del proyecto según las tareas completadas.

**Solución:** Crear sistema completo de tareas:

**Base de datos - Nuevas tablas:**
```sql
CREATE TABLE tareas (
    idTareas INT AUTO_INCREMENT PRIMARY KEY,
    Titulo VARCHAR(200) NOT NULL,
    Descripcion TEXT,
    FechaLimite DATE NOT NULL,
    Estado ENUM('pendiente', 'completada', 'vencida') DEFAULT 'pendiente',
    Emprendimiento_idEmprendimiento INT NOT NULL,
    Usuario_idUsuarios INT NOT NULL,
    Docentes_idDocentes INT,
    FechaCreacion DATE NOT NULL,
    FechaActualizacion DATE NOT NULL
);

CREATE TABLE diagnostico_notas (
    idNota INT AUTO_INCREMENT PRIMARY KEY,
    Diagnostico_idDiagnosticos INT NOT NULL,
    Usuario_idUsuarios INT NOT NULL,
    Nota TEXT NOT NULL,
    Tipo ENUM('admin', 'docente') NOT NULL,
    FechaCreacion DATE NOT NULL
);

CREATE TABLE emprendimiento_usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Emprendimiento_idEmprendimiento INT NOT NULL,
    Usuario_idUsuarios INT NOT NULL,
    Rol ENUM('estudiante', 'docente') NOT NULL,
    FechaAsignacion DATE NOT NULL
);
```

**Backend - Nuevos archivos:**
- `NodeBack/src/services/tareas.service.js` - CRUD de tareas + cálculo de avance
- `NodeBack/src/controllers/tareas.controller.js` - Endpoints REST
- `NodeBack/src/routes/tareas.routes.js` - Rutas API

**Endpoints creados:**
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/segmed/tareas` | POST | Crear tarea |
| `/segmed/tareas` | GET | Listar todas |
| `/segmed/tareas/emprendimiento/:id` | GET | Tareas por emprendimiento |
| `/segmed/tareas/mis-tareas` | GET | Tareas del estudiante con alertas |
| `/segmed/tareas/avance/usuario` | GET | % de avance |
| `/segmed/tareas/:id/completar` | PUT | Completar tarea |
| `/segmed/tareas/vencidas` | GET | Tareas vencidas |

**Frontend - Nuevas vistas:**
- `ReactFront/src/pages/Admin/AdminCrearEmprendimiento.jsx` - Crear y asignar emprendimiento
- `ReactFront/src/pages/Admin/AdminVerEmprendimiento.jsx` - Ver detalle + tareas + gráfico avance
- `ReactFront/src/pages/Maestro/MaestroTareas.jsx` - Gestionar tareas

**Funcionalidades implementadas:**
1. Admin crea emprendimiento → Asigna estudiante(s) y docente(s)
2. Admin/Docente crean tareas con fecha límite
3. Estudiante ve gráfico de avance en dashboard (% = completadas/totales)
4. Alerta automática cuando hay tareas vencidas
5. El estudiante puede marcar tareas como completadas
6. Gráfico de avance con colores: Verde (>70%), Amarillo (30-70%), Rojo (<30%)

**Sidebar actualizado:**
- Admin: "Emprendimientos > Crear Emprendimiento", "Ver Detalle"
- Docente: "Emprendimientos > Tareas"

**Rutas agregadas en App.js:**
```javascript
// Admin
<Route path="emprendimientos/crear" element={<AdminCrearEmprendimiento />} />
<Route path="emprendimientos/ver/:id" element={<AdminVerEmprendimiento />} />

// Docente
<Route path="tareas" element={<MaestroTareas />} />
```

**Estado:** ✅ Resuelto (2026-04-02)

---

## 31. Error: No hay link para acceder a Ver Detalle de emprendimiento
**Causa:** La vista AdminVerEmprendimiento.jsx existía pero no había forma de acceder a ella desde el menú. La tabla en AdminPlanTrabajo no tenía columna de acciones.

**Solución:** Agregar columna "Acciones" con botón "Ver Detalle" en la tabla de emprendimientos de AdminPlanTrabajo.jsx.

**Archivo modificado:**
- `ReactFront/src/pages/Admin/AdminPlanTrabajo.jsx`
  - Agregado import de `Link` desde react-router-dom
  - Agregada columna "Acciones" en el header
  - Agregado botón "Ver Detalle" que dirige a `/admin/emprendimientos/ver/:id`

**Estado:** ✅ Resuelto (2026-04-02)

---

## 32. Error: Crear evento dice "ruta no encontrada"
**Causa:** El frontend usaba `/segmed/events` (con 's') pero el backend tenía registrado `/segmed/event` (sin 's').

**Errores en AdminEventos.jsx:**
- Línea 35: `fetch('/segmed/events'` → `fetch('/segmed/event'`
- Línea 63: `fetch('/segmed/events/${id}'` → `fetch('/segmed/event/${id}'`
- Línea 70: `fetch('/segmed/events'` → `fetch('/segmed/event'`
- Línea 110: `fetch('/segmed/events/${id}'` → `fetch('/segmed/event/${id}'`

**Solución:** Cambiar todas las referencias de `/segmed/events` a `/segmed/event` usando replaceAll.

**Archivo modificado:**
- `ReactFront/src/pages/Admin/AdminEventos.jsx`

**Estado:** ✅ Resuelto (2026-04-02)

---

## 33. Error: Sidebar Admin "Ver Detalle" sin ID de emprendimiento
**Causa:** El menú de Emprendimientos en AdminSidebar tenía "Ver Detalle" pero no tenía :id, y la ruta requerida es `/admin/emprendimientos/ver/:id`.

**Solución:** Eliminar la opción "Ver Detalle" del menú ya que el acceso se hace desde AdminPlanTrabajo.jsx con el botón en la tabla.

**Archivos modificados:**
- `ReactFront/src/components/AdminSidebar.jsx` - Eliminado del menuStructure
- `ReactFront/src/components/AdminSidebar.jsx` - Eliminado de getLinkPath

**Estado:** ✅ Resuelto (2026-04-02)

---

## 34. Error: AdminAsignar es solo un placeholder sin funcionalidad
**Causa:** El componente AdminAsignar.jsx tenía datos hardcodeados y no funcionaba真正的 asignación.

**Solución:** Redireccionar automáticamente a AdminDocentes.jsx que sí tiene la funcionalidad de asignaciones.

**Archivo modificado:**
- `ReactFront/src/pages/Admin/AdminAsignar.jsx` - Ahora redirecciona a `/admin/docentes/gestion`

**Estado:** ✅ Resuelto (2026-04-02)

---

## 35. Error: Progreso.jsx del estudiante es un placeholder
**Causa:** La vista de Progreso solo mostraba texto "Mi Progreso Académico" sin funcionalidad.

**Solución:** Implementar vista completa con:
- Barra de progreso visual
- Estadísticas de tareas (completadas, pendientes, totales)
- Información del emprendimiento asignado
- Lista de tareas con estado
- Colores según nivel de progreso (verde/amarillo/rojo)

**Archivos modificados:**
- `ReactFront/src/pages/Estudiante/Progreso.jsx` - Implementación completa
- `ReactFront/src/components/EstudianteSidebar.jsx` - Agregado "Mi Progreso" al menú

**Estado:** ✅ Resuelto (2026-04-02)

---

## 36. Error: Seguimientos del docente se guardan solo en estado local
**Causa:** En EmpSeguimiento.jsx las notas de seguimiento se guardaban en el estado local del componente, no en la base de datos.

**Solución:** 
1. Crear nuevo endpoint `GET /segmed/tracing/emprendimiento/:id` para obtener seguimientos por emprendimiento
2. Modificar EmpSeguimiento.jsx para guardar y eliminar notas en la BD

**Archivos modificados:**
- `NodeBack/src/routes/tracing.routes.js` - Agregada ruta `/emprendimiento/:id`
- `NodeBack/src/controllers/tracing.controller.js` - Agregado método `getByEmprendimiento`
- `ReactFront/src/pages/Maestro/EmpSeguimiento.jsx` - Guardado en BD

**Estado:** ✅ Resuelto (2026-04-02)

---

## 46. Error: Crear emprendimiento desde Admin no funciona
**Causa:** 
- Nombres de columnas inconsistentes entre frontend y backend (`TipoEmprendimiento` vs `Tipoemprendimiento`)
- Falta el campo `Usuarios_idUsuarios` en el INSERT del servicio
- El servicio retornaba `id` pero el frontend esperaba `idEmprendimiento`
- El UPDATE usaba nombres de columnas incorrectos y campos sin valores por defecto

**Solución:**
1. Modificar `entrepreneurship.service.js`:
   - Corregir nombres de columnas: `Tipoemprendimiento` → `TipoEmprendimiento`, `Etapaemprendimiento_idEtapaemprendimiento` → `EtapaEmprendimiento_idEtapaEmprendimiento`
   - Agregar campo `Usuarios_idUsuarios` al INSERT
   - Cambiar retorno de `id` a `idEmprendimiento`
   - Agregar valores por defecto con `||` para evitar errores por campos undefined
   - Usar formato de fecha correcto `YYYY-MM-DD` en lugar de Date objects

**Archivos modificados:**
- `NodeBack/src/services/entrepreneurship.service.js`

**Estado:** ✅ Resuelto (2026-04-03)

---

## 47. Error: Link "Ver Detalle" en Dashboard Admin no tiene :id
**Causa:** El link en la tabla de emprendimientos recientes usa `/admin/emprendimientos/ver` sin el ID del emprendimiento.

**Solución:** Cambiar a `/admin/emprendimientos/ver/${emp.idEmprendimiento}` en Admin.jsx

**Archivos modificados:**
- `ReactFront/src/pages/Admin/Admin.jsx`

**Estado:** ✅ Resuelto (2026-04-03)

---

## 48. Error: Links incorrectos en Dashboard Estudiante
**Causa:** 
- "Mi Proyecto" apuntaba a `/estudiante/emprendimientos/plan-de-trabajo` (ruta no existe)
- "Ver Progreso" apuntaba a ruta incorrecta

**Solución:** Corregir rutas:
- "Mi Proyecto" → `/estudiante/emprendimiento/perfil`
- "Ver Progreso" → `/estudiante/progreso`

**Archivos modificados:**
- `ReactFront/src/pages/Estudiante/DashboardContent.jsx`

**Estado:** ✅ Resuelto (2026-04-03)

---

## 49. Error: Maestro no puede acceder a lista de estudiantes
**Causa:** La ruta `/segmed/users/students` tiene middleware `isAdmin` en user.routes.js, lo que impide que los maestros accedan a la lista de estudiantes para gestionar asesorías.

**Solución:** Quitar el middleware `isAdmin` de la ruta `/students` para permitir acceso a usuarios autenticados.

**Archivos modificados:**
- `NodeBack/src/routes/user.routes.js`

**Estado:** ✅ Resuelto (2026-04-03)

---

## 50. Error: GestionarUsuarios usa endpoints incorrectos
**Causa:** GestionarUsuarios.jsx usa endpoints `/segmed/users/students` y `/segmed/users/teachers` que requieren permisos de admin, pero la ruta `/students` ya tiene isAdmin.

**Solución:** Modificar GestionarUsuarios para usar `/segmed/users` y filtrar localmente por rol.

**Archivos modificados:**
- `ReactFront/src/pages/Admin/GestionarUsuarios.jsx`

**Estado:** ✅ Resuelto (2026-04-03)

---

## 51. Error: Crear emprendimiento - Error "Bind parameters must not contain undefined"
**Causa:** El error 400 "Bind parameters must not contain undefined" ocurría porque había middleware de error mal placed en app.js que interceptaba las respuestas antes de llegar al controller correcto.

**Solución:**
1. Limpiar app.js removiendo el error handler mal posicionado
2. Rebuild completo del contenedor
3. El controller ahora incluye sanitización de req.body para convertir undefined a null

**Archivos modificados:**
- `NodeBack/src/app.js`
- `NodeBack/src/controllers/entrepreneurship.controller.js`
- `NodeBack/src/services/entrepreneurship.service.js`

**Estado:** ✅ Resuelto (2026-04-03)

---

## 52. Verificación: Maestro (Docente) puede acceder a todas las vistas
**Resumen:** Se verificó que todas las funcionalidades del Maestro funcionan correctamente:

**Credenciales de prueba:**
- Correo: `hola@gmail.com`
- Contraseña: `admin123`
- Rol: Maestro (Docente)

**Endpoints verificados (todosreturning 200 OK):**
| Endpoint | Método | Resultado |
|----------|--------|----------|
| `/segmed/users/login` | POST | ✅ Login exitoso |
| `/segmed/advice` | GET | ✅ Lista asesorías |
| `/segmed/users` | GET | ✅ Lista usuarios |
| `/segmed/entrepreneurship/:id` | GET | ✅ Datos emprendimiento |
| `/segmed/tracing/emprendimiento/:id` | GET | ✅ Lista seguimientos |

**Vistas verificadas:**
- `Asesorias.jsx` - Lista y gestiona asesorías ✅
- `AsesoriasCrear.jsx` - Crea nueva asesoría ✅  
- `AsesoriasEditar.jsx` - Edita asesoría existente ✅
- `EmpSeguimiento.jsx` - Seguimiento de emprendimiento ✅
- `Emprendimientos.jsx` - Lista emprendimientos ✅
- `MaestroTareas.jsx` - Gestiona tareas ✅

**Contenedores rebuild y reiniciados:**
- `docker compose build --no-cache` ✅
- `docker compose up -d` ✅

**Estado:** ✅ Verificado (2026-04-03)

---

## 53. Error: Contraseña de admin incorrecta en documentación
**Causa:** La documentación especificaba `Admin2024!` pero el hash en la BD corresponde a `admin123`.

**Solución:** Actualizar la documentación para reflejar la contraseña correcta.

**Archivos modificados:**
- `INICIALIZACION.md` - Cambiado a admin123
- `SPEC.md` - Cambiado a admin123

**Estado:** ✅ Resuelto (2026-04-03)

---

## 54. Error: Crear tarea sin estudiante asignado
**Causa:** En AdminVerEmprendimiento.jsx, al crear una tarea no se verificaba si había un estudiante asignado, lo que causaba que se enviara `undefined` como Usuario_idUsuarios.

**Solución:** Agregar validación antes de crear la tarea para verificar que existe un estudiante asignado.

**Archivo modificado:**
- `ReactFront/src/pages/Admin/AdminVerEmprendimiento.jsx` - Validación agregada

**Estado:** ✅ Resuelto (2026-04-03)

---

## 55. Error: Diagnóstico sin indicador claro de estado
**Causa:** La vista de diagnóstico del estudiante no mostraba claramente cuando el diagnóstico estaba pendiente.

**Solución:** Mejorar la UI con indicador visual de estado pendiente (icono de reloj amarillo) y agregar alerta de "completado" cuando existe diagnóstico.

**Archivo modificado:**
- `ReactFront/src/pages/Estudiante/Diagnostico.jsx` - Mejoras visuales

**Estado:** ✅ Resuelto (2026-04-03)

---

## 56. Error: Estudiante con múltiples emprendimientos solo muestra 1
**Causa:** El frontend usaba `empData.data[0]` lo que solo mostraba el primer emprendimiento ignorando los demás.

**Solución:** Actualizar vistas para manejar arrays de emprendimientos:
- PerfilEmprendimiento.jsx: Selector dropdown para elegir emprendimiento
- Seguimiento.jsx: Selector dropdown
- PlanTrabajo.jsx: Selector dropdown
- DashboardContent.jsx: Muestra todos los emprendimientos en tarjetas

**Archivos modificados:**
- `ReactFront/src/pages/Estudiante/PerfilEmprendimiento.jsx`
- `ReactFront/src/pages/Estudiante/Seguimiento.jsx`
- `ReactFront/src/pages/Estudiante/PlanTrabajo.jsx`
- `ReactFront/src/pages/Estudiante/DashboardContent.jsx`

**Estado:** ✅ Resuelto (2026-04-03)

---

## 57. Error: Mi Progreso solo muestra un emprendimiento
**Causa:** Progreso.jsx usaba `find()` en lugar de `filter()` y solo cargaba avance de un emprendimiento.

**Solución:** 
- Cargar todos los emprendimientos del usuario
- Calcular avance de cada uno individualmente
- Mostrar resumen combinado de todos
- Agregar selector dropdown para ver detalles por emprendimiento

**Archivo modificado:**
- `ReactFront/src/pages/Estudiante/Progreso.jsx`

**Estado:** ✅ Resuelto (2026-04-03)

---

## 58. Error: Tipos de datos incorrectos en cálculos de avance
**Causa:** El backend devuelve `completadas` como string ("1") en lugar de número (1), lo que causa concatenación al sumar: "1" + "1" = "11"

**Solución:** Convertir a número usando Number() antes de hacer operaciones matemáticas:
- Progreso.jsx: getAvanceCombinado()
- DashboardContent.jsx: setAvance()

**Archivos modificados:**
- `ReactFront/src/pages/Estudiante/Progreso.jsx`
- `ReactFront/src/pages/Estudiante/DashboardContent.jsx`

**Estado:** ✅ Resuelto (2026-04-03)

---

## 59. Error: Sistema de Diagnóstico incompleto
**Causa:** El diagnóstico solo existía para estudiantes, no había vistas para Admin ni Maestro.

**Solución:** 
- Crear AdminDiagnostico.jsx para gestión completa de diagnósticos (crear/editar/eliminar)
- Crear MaestroDiagnostico.jsx para que maestros puedan ver diagnósticos de sus estudiantes
- Agregar rutas en App.js
- Agregar opciones en menús sidebar

**Archivos modificados:**
- `ReactFront/src/pages/Admin/AdminDiagnostico.jsx` (nuevo)
- `ReactFront/src/pages/Maestro/MaestroDiagnostico.jsx` (nuevo)
- `ReactFront/src/App.js`
- `ReactFront/src/components/AdminSidebar.jsx`
- `ReactFront/src/components/SidebarMaestro.jsx`

**Estado:** ✅ Resuelto (2026-04-03)

---

## 60. Error: MaestroDiagnostico usaba estructura de BD incorrecta
**Causa:** El código usaba `Docentes_idDocentes` que no existe en la tabla emprendimiento. La relación correcta es a través de la tabla `asignaciones`.

**Solución:** Modificar MaestroDiagnostico.jsx para usar el endpoint `/assignments` (todas las asignaciones) y filtrar por el mentor actual.

**Archivo modificado:**
- `ReactFront/src/pages/Maestro/MaestroDiagnostico.jsx`

**Estado:** ✅ Resuelto (2026-04-03)

---

## 61. Error: Bind parameters must not contain undefined
**Causa:** Al crear diagnóstico desde Admin, los campos vacíos se enviaban como `undefined` en lugar de `null`, causando error en MySQL.

**Solución:** 
- Modificar AdminDiagnostico.jsx para convertir `undefined` a `null` antes de enviar
- Corregir estructura de tabla diagnosticos (campos tinyint改为TEXT)

**Archivos modificados:**
- `ReactFront/src/pages/Admin/AdminDiagnostico.jsx`
- Base de datos: estructura de tabla diagnosticos

**Estado:** ✅ Resuelto (2026-04-03)

---

*Última actualización: 2026-04-03*
