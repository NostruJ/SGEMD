const express = require('express')
const router = express.Router()
const diagnostico = require('../controllers/diagnosis.controller')
const { authenticateToken } = require('../middleware/auth.middleware')

router.get('/', authenticateToken, diagnostico.getAll)
router.get('/me', authenticateToken, diagnostico.getMyDiagnosis)
router.get('/:id', authenticateToken, diagnostico.getById)
router.post('/', authenticateToken, diagnostico.create)
router.put('/:id', authenticateToken, diagnostico.update)
router.delete('/:id', authenticateToken, diagnostico.remove)

module.exports = router