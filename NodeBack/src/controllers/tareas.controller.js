const tareasService = require('../services/tareas.service');

exports.getAll = async (req, res) => {
    try {
        await tareasService.actualizarEstadosVencidos();
        const data = await tareasService.findAll();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await tareasService.findById(req.params.id);
        res.json({ success: true, data });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};

exports.getByEmprendimiento = async (req, res) => {
    try {
        await tareasService.actualizarEstadosVencidos();
        const data = await tareasService.findByEmprendimiento(req.params.empId);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getByUsuario = async (req, res) => {
    try {
        await tareasService.actualizarEstadosVencidos();
        const data = await tareasService.findByUsuario(req.params.userId);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getMisTareas = async (req, res) => {
    try {
        await tareasService.actualizarEstadosVencidos();
        const userId = req.user.id;
        const data = await tareasService.findByUsuario(userId);
        
        const vencidas = await tareasService.findTareasVencidasByUsuario(userId);
        
        res.json({ 
            success: true, 
            data, 
            alertas: vencidas.length > 0 ? `Tienes ${vencidas.length} tarea(s) vencida(s)` : null,
            tareasVencidas: vencidas
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getVencidas = async (req, res) => {
    try {
        const data = await tareasService.findVencidas();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAvanceEmprendimiento = async (req, res) => {
    try {
        const data = await tareasService.getAvanceByEmprendimiento(req.params.empId);
        const avance = data.total > 0 ? Math.round((data.completadas / data.total) * 100) : 0;
        res.json({ success: true, data: { ...data, avance } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAvanceUsuario = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = await tareasService.getAvanceByUsuario(userId);
        const avance = data.total > 0 ? Math.round((data.completadas / data.total) * 100) : 0;
        res.json({ success: true, data: { ...data, avance } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const data = await tareasService.create(req.body);
        res.status(201).json({ success: true, data });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const updated = await tareasService.update(req.params.id, req.body);
        if (updated) {
            res.json({ success: true, message: 'Tarea actualizada' });
        } else {
            res.status(404).json({ success: false, error: 'Tarea no encontrada' });
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.completar = async (req, res) => {
    try {
        const completed = await tareasService.completar(req.params.id);
        if (completed) {
            res.json({ success: true, message: 'Tarea completada' });
        } else {
            res.status(404).json({ success: false, error: 'Tarea no encontrada' });
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await tareasService.remove(req.params.id);
        if (deleted) {
            res.json({ success: true, message: 'Tarea eliminada' });
        } else {
            res.status(404).json({ success: false, error: 'Tarea no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
