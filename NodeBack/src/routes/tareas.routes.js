const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareas.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/', authenticateToken, tareasController.getAll);
router.get('/mis-tareas', authenticateToken, tareasController.getMisTareas);
router.get('/vencidas', authenticateToken, tareasController.getVencidas);
router.get('/emprendimiento/:empId', authenticateToken, tareasController.getByEmprendimiento);
router.get('/usuario/:userId', authenticateToken, tareasController.getByUsuario);
router.get('/avance/emprendimiento/:empId', authenticateToken, tareasController.getAvanceEmprendimiento);
router.get('/avance/usuario', authenticateToken, tareasController.getAvanceUsuario);
router.get('/:id', authenticateToken, tareasController.getById);
router.post('/', authenticateToken, tareasController.create);
router.put('/:id', authenticateToken, tareasController.update);
router.put('/:id/completar', authenticateToken, tareasController.completar);
router.delete('/:id', authenticateToken, tareasController.remove);

module.exports = router;
