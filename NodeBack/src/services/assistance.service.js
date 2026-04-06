const { pool } = require('../config/db.config')

exports.findAll = async () => {
    const [rows] = await pool.execute('SELECT * FROM asistencia')
    return rows
}

exports.findById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM asistencia WHERE idasistencia = ?', [id]);
    if (rows.length === 0) throw new Error('asistencia no encontrada');
    return rows[0]
}

exports.create = async (data) => {
    const fechaActual = new Date()
    const [result] = await pool.execute(
    `INSERT INTO asistencia (
            FeedBack, Emprendimiento_idEmprendimiento, FechaCreacion, FechaActualizacion, Seguimientos_idSeguimientos
        ) VALUES (?, ?, ?, ?, ?)`,
        [
            data.FeedBack,
            data.Emprendimiento_idEmprendimiento,
            fechaActual,
            fechaActual,
            data.Seguimientos_idSeguimientos
        ]
    )
    return { id: result.insertId, ...data };
}

exports.update = async (id, data) => {
    const [result] = await pool.execute(
    `UPDATE asistencia SET
            FeedBack = ?, Emprendimiento_idEmprendimiento = ?, FechaActualizacion = ?, Seguimientos_idSeguimientos = ?
    WHERE idasistencia = ?`,
        [
            data.FeedBack,
            data.Emprendimiento_idEmprendimiento,
            new Date(),
            data.Seguimientos_idSeguimientos,
            id
        ]
    )
    return result.affectedRows > 0;
}

exports.remove = async (id) => {
    const [result] = await pool.execute(
    'DELETE FROM asistencia WHERE idasistencia = ?', [id]
    )
    return result.affectedRows > 0;
}