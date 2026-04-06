// Rutas para la gestión de usuarios
const express = require('express')
const router = express.Router()
const usersController = require('../controllers/user.controller')
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware')
const multer = require('multer');
const path = require('path');

// Configuración multer para avatars
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads', 'avatars'))
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${Date.now()}${ext}`)
  }
});
const upload = multer({ storage });

//RUTAS PÚBLICAS
router.post('/login', usersController.loginUser)
router.post('/register', usersController.createUser)

// Ruta para que el admin cree usuarios (protegida)
router.post('/admin', authenticateToken, isAdmin, usersController.createUser)
router.post('/verify', usersController.verifyUser)

// Ruta de prueba para verificar que el correo funciona
router.post('/test-email', async (req, res) => {
  try {
    const { destinatario, nombre, codigo } = req.body;

    if (!destinatario || !nombre || !codigo) {
      return res.status(400).json({
        success: false,
        error: 'Faltan parámetros: destinatario, nombre, codigo'
      });
    }

    const { enviarCorreoVerificacion } = require('../config/mailer');
    const result = await enviarCorreoVerificacion(destinatario, nombre, codigo);

    res.json({
      success: true,
      message: 'Correo de prueba enviado',
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

//RUTAS PROTEGIDAS (se declaran ANTES que /:id para evitar conflictos de routing)
router.get('/me', authenticateToken, usersController.getMe)
router.get('/', authenticateToken, usersController.getAllUsers)
router.get('/students', authenticateToken, usersController.getAllStudents)
router.get('/teachers', authenticateToken, usersController.getAllTeachers)
router.get('/admins', authenticateToken, isAdmin, usersController.getAllAdmins)
router.post('/:id/reactivate', authenticateToken, isAdmin, usersController.reactivateUser)
router.post('/:id/request-reactivation', authenticateToken, usersController.requestReactivation)
router.delete('/:id/hard', authenticateToken, isAdmin, usersController.hardDeleteUser)

// RUTAS DINÁMICAS (por ID) - DEBEN IR AL FINAL
router.get('/:id', authenticateToken, usersController.getUsersById)
router.put('/:id', authenticateToken, usersController.updateUser)
// Permitir que el propio usuario elimine su cuenta o un admin la desactive
router.delete('/:id', authenticateToken, usersController.deleteUser)

// Subir/actualizar avatar de usuario
router.post('/:id/avatar', authenticateToken, upload.single('avatar'), usersController.uploadAvatar)

//EMPRENDIMIENTOS DE ESTUDIANTE
router.get('/:id/entrepreneurships', authenticateToken, usersController.getStudentEntrepreneurships)

module.exports = router
