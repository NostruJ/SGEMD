const express = require('express')
const router = express.Router()
const event = require('../controllers/event.controller')
const { authenticateToken } = require('../middleware/auth.middleware')

// Rutas con autenticación
router.get('/', authenticateToken, event.getAll)
router.get('/user/:userId', authenticateToken, event.getUserEvents)
router.get('/:id', authenticateToken, event.getById)
router.post('/', authenticateToken, event.create)
router.put('/:id', authenticateToken, event.update)
router.delete('/:id', authenticateToken, event.remove)
router.post('/:id/register', authenticateToken, event.register)
router.delete('/:id/register', authenticateToken, event.unregister)

module.exports = router