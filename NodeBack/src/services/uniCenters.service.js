const { pool } = require('../config/db.config')

exports.findAll = async () => {
    const [rows] = await pool.execute('SELECT * FROM centrouniversitarios')
    return rows
}

exports.findById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM centrouniversitarios WHERE idcentrouniversitarios = ?', [id])
    if (rows.length === 0) throw new Error('Centro Universitario no encontrado')
    return rows[0]
}

exports.create = async (data) => {
    // Ajusta los campos según la tabla
    const fechaActual = new Date()
    const [result] = await pool.execute(
        'INSERT INTO centrouniversitarios (Nombre, FechaCreacion, FechaActualizacion) VALUES (?, ?, ?)',
        [data.Nombre,fechaActual,fechaActual]
    )
    return { id: result.insertId, ...data }
}

exports.update = async (id, data) => {
    // Ajusta los campos según la tabla
    const [result] = await pool.execute(
        'UPDATE centrouniversitarios SET Nombre = ?, FechaActualizacion = ? WHERE idcentrouniversitarios = ?',
        [data.Nombre, new Date(), id]
    )
    return result.affectedRows > 0
}

exports.remove = async (id) => {
    const [result] = await pool.execute(
        'DELETE FROM centrouniversitarios WHERE idcentrouniversitarios = ?', [id]
    )
    return result.affectedRows > 0;
}