const { pool } = require('../config/db.config');

exports.findAll = async () => {
    const [rows] = await pool.execute('SELECT * FROM seguimientos ORDER BY FechaCreacion DESC');
    return rows;
};

exports.findById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM seguimientos WHERE idSeguimientos = ?', [id]);
    if (rows.length === 0) throw new Error('Seguimiento no encontrado');
    return rows[0];
};

exports.findByEmprendimiento = async (empId) => {
    const [rows] = await pool.execute(
        'SELECT s.*, u.Nombre as DocenteNombre FROM seguimientos s LEFT JOIN usuarios u ON s.Usuarios_idUsuarios = u.idUsuarios WHERE s.Emprendimiento_idEmprendimiento = ? ORDER BY s.FechaCreacion DESC',
        [empId]
    );
    return rows;
};

exports.create = async (data) => {
    const [result] = await pool.execute(
        `INSERT INTO seguimientos (
            histproal, TipoSeguimiento, Descripcion, SeguimientoCol,
            FechaCreacion, FechaActualizacion
        ) VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [
            data.histproal || 'Seguimiento',
            data.TipoSeguimiento || 'Nota',
            data.Descripcion,
            data.SeguimientoCol || null
        ]
    );
    return { id: result.insertId, ...data };
};

exports.update = async (id, data) => {
    const [result] = await pool.execute(
        `UPDATE seguimientos SET 
            histproal = ?, TipoSeguimiento = ?, Descripcion = ?, SeguimientoCol = ?,
            FechaActualizacion = NOW()
        WHERE idSeguimientos = ?`,
        [
            data.histproal,
            data.TipoSeguimiento,
            data.Descripcion,
            data.SeguimientoCol,
            id
        ]
    );
    return result.affectedRows > 0;
};

exports.remove = async (id) => {
    const [result] = await pool.execute('DELETE FROM seguimientos WHERE idSeguimientos = ?', [id]);
    return result.affectedRows > 0;
};
