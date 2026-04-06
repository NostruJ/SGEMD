const express = require('express')
const router = express.Router()
const event = require('../controllers/event.controller')
const { authenticateToken } = require('../middleware/auth.middleware')

router.get('/', event.getAll)
router.get('/user/:userId', event.getUserEvents)
router.get('/:id', event.getById)
router.post('/', event.create)
router.put('/:id', event.update)
router.delete('/:id', event.remove)
router.post('/:id/register', authenticateToken, event.register)
router.delete('/:id/register', authenticateToken, event.unregister)

module.exports = router