const express = require('express')
const router = express.Router()
const entrepreneurshipController = require('../controllers/entrepreneurship.controller')
const { authenticateToken } = require('../middleware/auth.middleware')

// Rutas con autenticación
router.get('/', authenticateToken, entrepreneurshipController.getAll)
router.get('/:id', authenticateToken, entrepreneurshipController.getById)
router.post('/', authenticateToken, entrepreneurshipController.create)
router.put('/:id', authenticateToken, entrepreneurshipController.update)
router.delete('/:id', authenticateToken, entrepreneurshipController.remove)

module.exports = router