//Dependencias principales
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { testConnection } = require('./config/db.config');

//Importar rutas
const userRoutes = require('./routes/user.routes');
const moduleRoutes = require('./routes/module.routes');
const municipalitiesRoutes = require('./routes/municipalities.routes');
const academicProgramRoutes = require('./routes/academicProgram.routes');
const roles = require('./routes/roles.routes');
const tipoDoc = require('./routes/typeDoc.routes');
const tipoUsuario = require('./routes/typeUsers.routes');
const uniCenters = require('./routes/uniCenters.routes');
const tipoPoblacion = require('./routes/typePop.routes');
const EtapadeEmprendimiento = require('./routes/entrepStage.routes');
const emprendimiento = require('./routes/entrepreneurship.routes');
const tracing = require('./routes/tracing.routes');
const assistance = require('./routes/assistance.routes');
const econoSector = require('./routes/econoSector.routes');
const diagnosis = require('./routes/diagnosis.routes');
const mode = require('./routes/mode.routes');
const advice = require('./routes/advice.routes');
const event = require('./routes/event.routes');
const typeEvent = require('./routes/typeEvent.routes');
const dateTimes = require('./routes/dateTimes.routes');
const assignments = require('./routes/assignments.routes');
const tareas = require('./routes/tareas.routes');

// Configuración base de la app
const app = express();
const PORT = process.env.PORT || 3005;

// ============================
// 🔹 Middleware global
// ============================
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'], // Permite peticiones desde React
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
}));

// Responder a preflight requests para todas las rutas
app.options('*', cors());

// Parse cookies when frontend uses credentialed requests
app.use(cookieParser());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos para imágenes subidas (avatars)
app.use('/uploads', express.static(require('path').join(__dirname, '..', 'uploads')));

// ============================
// 🔹 Rutas del sistema
// ============================
app.use('/segmed/users', userRoutes);
app.use('/segmed/module', moduleRoutes);
app.use('/segmed/municipalities', municipalitiesRoutes);
app.use('/segmed/academic-programs', academicProgramRoutes);
app.use('/segmed/roles', roles);
app.use('/segmed/type-doc', tipoDoc);
app.use('/segmed/type-users', tipoUsuario);
app.use('/segmed/uni-centers', uniCenters);
app.use('/segmed/type-pop', tipoPoblacion);
app.use('/segmed/entrep-stage', EtapadeEmprendimiento);
app.use('/segmed/entrepreneurship', emprendimiento);
app.use('/segmed/tracing', tracing);
app.use('/segmed/assistance', assistance);
app.use('/segmed/econo-sector', econoSector);
app.use('/segmed/diagnosis', diagnosis);
app.use('/segmed/mode', mode);
app.use('/segmed/advice', advice);
app.use('/segmed/event', event);
app.use('/segmed/type-event', typeEvent);
app.use('/segmed/date-times', dateTimes);
app.use('/segmed/assignments', assignments);
app.use('/segmed/tareas', tareas);

// ============================
// 🔹 Ruta base de prueba
// ============================
app.get('/segmed', (req, res) => {
  res.json({
    success: true,
    message: 'API de SEG-MED activa 🚀',
  });
});

// 🔹 Rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Ruta no encontrada' });
});

// ============================
// 🔹 Inicializar servidor
// ============================
async function startServer() {
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('No se pudo conectar a la base de datos.');
    process.exit(1);
  }

  // Error handler middleware
  app.use((err, req, res, next) => {
    console.error('Error global:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ success: false, error: err.message });
  });

  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en: http://localhost:${PORT}`);
    console.log(`API disponible en: http://localhost:${PORT}/segmed/`);
  });
}

startServer();
