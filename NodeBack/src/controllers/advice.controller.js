const asesoria = require('../services/advice.service');

exports.getAll = async (req, res) => {
    try {
        const filters = {};
        
        const rolUsuario = parseInt(req.user?.Roles_idRoles1) || 0;
        
        // Si es maestro (rol 3), solo mostrar sus asesorías
        if (rolUsuario === 3) {
            filters.docenteId = req.user.idusuarios;
        }
        // Si es estudiante (rol 2), solo mostrar sus asesorías
        else if (rolUsuario === 2) {
            filters.estudianteId = req.user.idusuarios;
        }
        // Admin (rol 1) ve todas las asesorías sin filtro
        
        const data = await asesoria.findAll(filters);
        res.json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

exports.getById = async (req, res) => {
    try {
        const data = await asesoria.findById(req.params.id)
        res.json({ success: true, data: data })
    } catch (error) {
        res.status(404).json({ success: false, error: error.message })
    }
}

exports.create = async (req, res) => {
    try {
        const data = await asesoria.create(req.body)
        res.status(201).json({ success: true, data: data })
    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
}

exports.update = async (req, res) => {
    try {
        const updated = await asesoria.update(req.params.id, req.body)
        if (updated) {
            res.json({ success: true, message: 'Asesoria actualizado' })
        } else {
            res.status(404).json({ success: false, error: 'Asesoria no encontrado' })
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
}

exports.remove = async (req, res) => {
    try {
        const deleted = await asesoria.remove(req.params.id)
        if (deleted) {
            res.json({ success: true, message: 'Asesoria eliminado' })
        } else {
            res.status(404).json({ success: false, error: 'Asesoria no encontrado' })
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
};