const asistencia = require('../services/event.service');

exports.getAll = async (req, res) => {
    try {
        const data = await asistencia.findAll()
        res.json({ success: true, data: data })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

exports.getById = async (req, res) => {
    try {
        const data = await asistencia.findById(req.params.id)
        res.json({ success: true, data: data })
    } catch (error) {
        res.status(404).json({ success: false, error: error.message })
    }
}

exports.create = async (req, res) => {
    try {
        const data = await asistencia.create(req.body)
        res.status(201).json({ success: true, data: data })
    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
}

exports.update = async (req, res) => {
    try {
        const updated = await asistencia.update(req.params.id, req.body)
        if (updated) {
            res.json({ success: true, message: 'Evento actualizado' })
        } else {
            res.status(404).json({ success: false, error: 'Evento no encontrado' })
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
}

exports.remove = async (req, res) => {
    try {
        const deleted = await asistencia.remove(req.params.id)
        if (deleted) {
            res.json({ success: true, message: 'Evento eliminado' })
        } else {
            res.status(404).json({ success: false, error: 'Evento no encontrado' })
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

exports.register = async (req, res) => {
    try {
        const { usuarioId } = req.body;
        const eventoId = req.params.id;
        
        const { pool } = require('../config/db.config');
        
        const [result] = await pool.execute(
            'INSERT INTO usuarios_has_Eventos (Usuarios_idUsuarios, Eventos_idEventos) VALUES (?, ?)',
            [usuarioId, eventoId]
        );
        
        res.status(201).json({ success: true, message: 'Registrado en evento exitosamente' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ success: false, error: 'Ya estás registrado en este evento' });
        } else {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

exports.unregister = async (req, res) => {
    try {
        const { usuarioId } = req.body;
        const eventoId = req.params.id;
        
        const { pool } = require('../config/db.config');
        
        const [result] = await pool.execute(
            'DELETE FROM usuarios_has_Eventos WHERE Usuarios_idUsuarios = ? AND Eventos_idEventos = ?',
            [usuarioId, eventoId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'No encontrado' });
        }
        
        res.json({ success: true, message: 'Desregistrado del evento' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

exports.getUserEvents = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const { pool } = require('../config/db.config');
        
        const [rows] = await pool.execute(`
            SELECT e.* FROM eventos e
            INNER JOIN usuarios_has_Eventos ue ON e.idEventos = ue.Eventos_idEventos
            WHERE ue.Usuarios_idUsuarios = ?
        `, [userId]);
        
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}