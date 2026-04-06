const { pool } = require('../config/db.config')

exports.findAll = async () => {
    const [rows] = await pool.execute('SELECT * FROM etapaemprendimiento')
    return rows
}

exports.findById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM etapaemprendimiento WHERE idetapaemprendimiento = ?', [id])
    if (rows.length === 0) throw new Error('Etapa de emprendimiento no encontrado')
    return rows[0]
}

exports.create = async (data) => {
    // Ajusta los campos según la tabla
    const fechaActual = new Date()
    const [result] = await pool.execute(
    'INSERT INTO etapaemprendimiento (Estado, FechaCreacion, FechaActualizacion, TipoEtapa) VALUES (?, ?, ?, ?)',
        [data.Estado,fechaActual,fechaActual,data.TipoEtapa]
    )
    return { id: result.insertId, ...data }
}

exports.update = async (id, data) => {
    // Ajusta los campos según la tabla
    const [result] = await pool.execute(
    'UPDATE etapaemprendimiento SET Estado = ?, FechaActualizacion = ?, TipoEtapa = ? WHERE idetapaemprendimiento = ?',
        [data.Estado, new Date(), data.TipoEtapa,id]
    )
    return result.affectedRows > 0
}

exports.remove = async (id) => {
    const [result] = await pool.execute(
    'DELETE FROM etapaemprendimiento WHERE idetapaemprendimiento = ?', [id]
    )
    return result.affectedRows > 0;
}