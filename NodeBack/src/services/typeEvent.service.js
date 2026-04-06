const { pool } = require('../config/db.config')

exports.findAll = async () => {
    const [rows] = await pool.execute('SELECT * FROM tipo_evento')
    return rows
}

exports.findById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM tipo_evento WHERE idtipo_evento = ?', [id])
    if (rows.length === 0) throw new Error('Tipo de evento no encontrado')
    return rows[0]
}

exports.create = async (data) => {
    const [result] = await pool.execute(
        `INSERT INTO tipo_evento (
            idtipo_evento, Academico, Cultura, Deportivo, Social, Conferencia
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
            data.idtipo_evento,
            data.Academico,
            data.Cultura,
            data.Deportivo,
            data.Social,
            data.Conferencia
        ]
    )
    return { id: result.insertId, ...data }
}

exports.update = async (id, data) => {
    const [result] = await pool.execute(
        `UPDATE tipo_evento SET
            Academico = ?, Cultura = ?, Deportivo = ?, Social = ?, Conferencia = ?
        WHERE idtipo_evento = ?`,
        [
            data.Academico,
            data.Cultura,
            data.Deportivo,
            data.Social,
            data.Conferencia,
            id
        ]
    )
    return result.affectedRows > 0
}

exports.remove = async (id) => {
    const [result] = await pool.execute(
        'DELETE FROM tipo_evento WHERE idtipo_evento = ?', [id]
    )
    return result.affectedRows > 0
}