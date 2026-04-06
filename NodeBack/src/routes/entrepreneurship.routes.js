const express = require('express')
const router = express.Router()
const entrepreneurshipController = require('../controllers/entrepreneurship.controller')

// Rutas sin autenticación para testing
router.get('/', entrepreneurshipController.getAll)
router.get('/:id', entrepreneurshipController.getById)
router.post('/', entrepreneurshipController.create)
router.put('/:id', entrepreneurshipController.update)
router.delete('/:id', entrepreneurshipController.remove)

module.exports = router