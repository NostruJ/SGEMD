const express = require('express')
const router = express.Router()
const tracing = require('../controllers/tracing.controller')
const { authenticateToken } = require('../middleware/auth.middleware')

router.get('/', authenticateToken, tracing.getAll)
router.get('/emprendimiento/:empId', authenticateToken, tracing.getByEmprendimiento)
router.get('/:id', authenticateToken, tracing.getById)
router.post('/', authenticateToken, tracing.create)
router.put('/:id', authenticateToken, tracing.update)
router.delete('/:id', authenticateToken, tracing.remove)

module.exports = router