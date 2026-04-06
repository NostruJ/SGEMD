const { pool } = require('../config/db.config')

exports.findAll = async () => {
    const [rows] = await pool.execute('SELECT * FROM tipodocumentos')
    return rows
}

exports.findById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM tipodocumentos WHERE idTipoDocumento = ?', [id])
    if (rows.length === 0) throw new Error('Tipo de documento no encontrado')
    return rows[0]
}

exports.create = async (data) => {
    // Ajusta los campos según la tabla
    const fechaActual = new Date()
    const [result] = await pool.execute(
        'INSERT INTO tipodocumentos (TipoDocumento, FechaCreacion, FechaActualizacion) VALUES (?, ?, ?)',
        [data.TipoDocumento,fechaActual,fechaActual]
    )
    return { id: result.insertId, ...data }
}

exports.update = async (id, data) => {
    // Ajusta los campos según la tabla
    const [result] = await pool.execute(
        'UPDATE tipodocumentos SET TipoDocumento = ?, FechaActualizacion = ? WHERE idTipoDocumento = ?',
        [data.TipoDocumento, new Date(), id]
    )
    return result.affectedRows > 0
}

exports.remove = async (id) => {
    const [result] = await pool.execute(
        'DELETE FROM tipodocumentos WHERE idTipoDocumento = ?', [id]
    )
    return result.affectedRows > 0;
}