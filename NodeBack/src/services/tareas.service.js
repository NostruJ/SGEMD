const { pool } = require('../config/db.config');

exports.findAll = async () => {
    const [rows] = await pool.execute('SELECT * FROM tareas ORDER BY FechaLimite ASC');
    return rows;
};

exports.findById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM tareas WHERE idTareas = ?', [id]);
    if (rows.length === 0) throw new Error('Tarea no encontrada');
    return rows[0];
};

exports.findByEmprendimiento = async (empId) => {
    const [rows] = await pool.execute(
        'SELECT t.*, u.Nombre as EstudianteNombre FROM tareas t JOIN usuarios u ON t.Usuario_idUsuarios = u.idUsuarios WHERE t.Emprendimiento_idEmprendimiento = ? ORDER BY t.FechaLimite ASC',
        [empId]
    );
    return rows;
};

exports.findByUsuario = async (userId) => {
    const [rows] = await pool.execute(
        'SELECT t.*, e.Nombre as EmprendimientoNombre FROM tareas t JOIN emprendimiento e ON t.Emprendimiento_idEmprendimiento = e.idEmprendimiento WHERE t.Usuario_idUsuarios = ? ORDER BY t.FechaLimite ASC',
        [userId]
    );
    return rows;
};

exports.findVencidas = async () => {
    const [rows] = await pool.execute(
        "SELECT t.*, u.Nombre as EstudianteNombre, e.Nombre as EmprendimientoNombre FROM tareas t JOIN usuarios u ON t.Usuario_idUsuarios = u.idUsuarios JOIN emprendimiento e ON t.Emprendimiento_idEmprendimiento = e.idEmprendimiento WHERE t.FechaLimite < CURDATE() AND t.Estado != 'completada' ORDER BY t.FechaLimite ASC"
    );
    return rows;
};

exports.findTareasVencidasByUsuario = async (userId) => {
    const [rows] = await pool.execute(
        "SELECT t.*, e.Nombre as EmprendimientoNombre FROM tareas t JOIN emprendimiento e ON t.Emprendimiento_idEmprendimiento = e.idEmprendimiento WHERE t.Usuario_idUsuarios = ? AND t.FechaLimite < CURDATE() AND t.Estado != 'completada'",
        [userId]
    );
    return rows;
};

exports.getAvanceByEmprendimiento = async (empId) => {
    const [rows] = await pool.execute(
        "SELECT COUNT(*) as total, SUM(CASE WHEN Estado = 'completada' THEN 1 ELSE 0 END) as completadas FROM tareas WHERE Emprendimiento_idEmprendimiento = ?",
        [empId]
    );
    return rows[0];
};

exports.getAvanceByUsuario = async (userId) => {
    const [rows] = await pool.execute(
        "SELECT COUNT(*) as total, SUM(CASE WHEN Estado = 'completada' THEN 1 ELSE 0 END) as completadas FROM tareas WHERE Usuario_idUsuarios = ?",
        [userId]
    );
    return rows[0];
};

exports.create = async (data) => {
    const [result] = await pool.execute(
        `INSERT INTO tareas (
            Titulo, Descripcion, FechaLimite, Estado, 
            Emprendimiento_idEmprendimiento, Usuario_idUsuarios, 
            Docentes_idDocentes, FechaCreacion, FechaActualizacion
        ) VALUES (?, ?, ?, 'pendiente', ?, ?, ?, NOW(), NOW())`,
        [
            data.Titulo,
            data.Descripcion,
            data.FechaLimite,
            data.Emprendimiento_idEmprendimiento,
            data.Usuario_idUsuarios,
            data.Docentes_idDocentes || null
        ]
    );
    return { id: result.insertId, ...data };
};

exports.update = async (id, data) => {
    const [result] = await pool.execute(
        `UPDATE tareas SET 
            Titulo = ?, Descripcion = ?, FechaLimite = ?, Estado = ?,
            FechaActualizacion = NOW()
        WHERE idTareas = ?`,
        [
            data.Titulo,
            data.Descripcion,
            data.FechaLimite,
            data.Estado,
            id
        ]
    );
    return result.affectedRows > 0;
};

exports.completar = async (id) => {
    const [result] = await pool.execute(
        "UPDATE tareas SET Estado = 'completada', FechaActualizacion = NOW() WHERE idTareas = ?",
        [id]
    );
    return result.affectedRows > 0;
};

exports.actualizarEstadosVencidos = async () => {
    const [result] = await pool.execute(
        "UPDATE tareas SET Estado = 'vencida' WHERE FechaLimite < CURDATE() AND Estado = 'pendiente'"
    );
    return result.affectedRows;
};

exports.remove = async (id) => {
    const [result] = await pool.execute('DELETE FROM tareas WHERE idTareas = ?', [id]);
    return result.affectedRows > 0;
};
