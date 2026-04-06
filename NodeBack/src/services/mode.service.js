const { pool } = require('../config/db.config')

exports.findAll = async () => {
    const [rows] = await pool.execute('SELECT * FROM modalidad')
    return rows
}

exports.findById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM modalidad WHERE idmodalidad = ?', [id])
    if (rows.length === 0) throw new Error('modalidad no encontrada')
    return rows[0]
}

exports.create = async (data) => {
    const [result] = await pool.execute(
        `INSERT INTO modalidad (
            idmodalidad, Presencial, Distancia, Enlace_virtual, Lugar
        ) VALUES (?, ?, ?, ?, ?)`,
        [
            data.idmodalidad,
            data.Presencial,
            data.Distancia,
            data.Enlace_virtual,
            data.Lugar
        ]
    )
    return { id: result.insertId, ...data }
}

exports.update = async (id, data) => {
    const [result] = await pool.execute(
        `UPDATE modalidad SET
            Presencial = ?, Distancia = ?, Enlace_virtual = ?, Lugar = ?
        WHERE idmodalidad = ?`,
        [
            data.Presencial,
            data.Distancia,
            data.Enlace_virtual,
            data.Lugar,
            id
        ]
    )
    return result.affectedRows > 0
}

exports.remove = async (id) => {
    const [result] = await pool.execute(
        'DELETE FROM modalidad WHERE idmodalidad = ?', [id]
    )
    return result.affectedRows > 0
}