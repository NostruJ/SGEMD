const { pool } = require('../config/db.config')

exports.findAll = async () => {
    const [rows] = await pool.execute('SELECT * FROM seguimientos')
    return rows;
}

exports.findById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM seguimientos WHERE idseguimientos = ?', [id])
    if (rows.length === 0) throw new Error('Seguimiento no encontrado')
    return rows[0]
}

exports.findByEmprendimiento = async (empId) => {
    const [rows] = await pool.execute(
        'SELECT * FROM seguimientos WHERE Emprendimiento_idEmprendimiento = ? ORDER BY FechaCreacion DESC', 
        [empId]
    );
    return rows;
}

exports.create = async (data) => {
    const fechaActual = new Date().toISOString().split('T')[0];
    const [result] = await pool.execute(
        `INSERT INTO seguimientos (
            histproal, TipoSeguimiento, Descripcion, SeguimientoCol,
            FechaCreacion, FechaActualizacion, Emprendimiento_idEmprendimiento
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            data.histproal || 'Seguimiento',
            data.TipoSeguimiento || 'Nota',
            data.Descripcion || '',
            data.SeguimientoCol || null,
            fechaActual,
            fechaActual,
            data.Emprendimiento_idEmprendimiento || null
        ]
    )
    return { idSeguimientos: result.insertId, ...data };
}

exports.update = async (id, data) => {
    const [result] = await pool.execute(
        `UPDATE seguimientos SET
            histproal = ?, TipoSeguimiento = ?, Descripcion = ?, SeguimientoCol = ?,
            FechaActualizacion = ?
        WHERE idseguimientos = ?`,
        [
            data.histproal,
            data.TipoSeguimiento,
            data.Descripcion,
            data.SeguimientoCol,
            new Date(),
            id
        ]
    )
    return result.affectedRows > 0;
}

exports.remove = async (id) => {
    const [result] = await pool.execute(
        'DELETE FROM seguimientos WHERE idseguimientos = ?', [id]
    )
    return result.affectedRows > 0;
}