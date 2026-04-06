const express = require('express');
const router = express.Router();
const assignmentsController = require('../controllers/assignments.controller');
const { authenticateToken, isAdmin, isTeacher } = require('../middleware/auth.middleware');

router.get('/', authenticateToken, assignmentsController.getAll);
router.get('/mentor/:mentorId', authenticateToken, assignmentsController.getByMentor);
router.get('/estudiante/:estudianteId', authenticateToken, assignmentsController.getByEstudiante);
router.get('/:id', authenticateToken, assignmentsController.getById);
router.post('/', authenticateToken, isAdmin, assignmentsController.create);
router.put('/:id', authenticateToken, isAdmin, assignmentsController.update);
router.delete('/:id', authenticateToken, isAdmin, assignmentsController.remove);

module.exports = router;