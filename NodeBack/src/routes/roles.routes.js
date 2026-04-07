const express = require('express')
const router = express.Router()
const rolesController = require('../controllers/roles.controller')
const { authenticateToken } = require('../middleware/auth.middleware')

// Rutas con autenticación
router.get('/', authenticateToken, rolesController.getAll)
router.get('/:id', authenticateToken, rolesController.getById)
router.post('/', authenticateToken, rolesController.create)
router.put('/:id', authenticateToken, rolesController.update)
router.delete('/:id', authenticateToken, rolesController.remove)

module.exports = router