const assignments = require('../services/assignments.service');

exports.getAll = async (req, res) => {
    try {
        const data = await assignments.findAll();
        res.json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await assignments.findById(req.params.id);
        res.json({ success: true, data: data });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};

exports.getByMentor = async (req, res) => {
    try {
        const data = await assignments.findByMentor(req.params.mentorId);
        res.json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getByEstudiante = async (req, res) => {
    try {
        const data = await assignments.findByEstudiante(req.params.estudianteId);
        res.json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const data = await assignments.create(req.body);
        res.status(201).json({ success: true, data: data });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const updated = await assignments.update(req.params.id, req.body);
        if (updated) {
            res.json({ success: true, message: 'Asignación actualizada' });
        } else {
            res.status(404).json({ success: false, error: 'Asignación no encontrada' });
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await assignments.remove(req.params.id);
        if (deleted) {
            res.json({ success: true, message: 'Asignación eliminada' });
        } else {
            res.status(404).json({ success: false, error: 'Asignación no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};