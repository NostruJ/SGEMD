const { pool } = require('../config/db.config')

exports.findAll = async () => {
    const [rows] = await pool.execute('SELECT * FROM eventos')
    return rows
}

exports.findById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM eventos WHERE ideventos = ?', [id])
    if (rows.length === 0) throw new Error('Evento no encontrado')
    return rows[0]
}

exports.create = async (data) => {
    const [result] = await pool.execute(
        `INSERT INTO eventos (
            ideventos, Nombre_evento, Descripcion_evento, Tipo_evento_idTipo_evento,
            Modalidad_idModalidad, Fecha_y_Horarios_idFecha_y_Horarios, Estado,
            Capacidad_maxima, Requiere_registro, Fecha_creacion, Fecha_actualizacion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.ideventos,
            data.Nombre_evento,
            data.Descripcion_evento,
            data.Tipo_evento_idTipo_evento,
            data.Modalidad_idModalidad,
            data.Fecha_y_Horarios_idFecha_y_Horarios,
            data.Estado,
            data.Capacidad_maxima,
            data.Requiere_registro,
            data.Fecha_creacion,
            data.Fecha_actualizacion
        ]
    )
    return { id: result.insertId, ...data }
}

exports.update = async (id, data) => {
    const [result] = await pool.execute(
        `UPDATE eventos SET
            Nombre_evento = ?, Descripcion_evento = ?, Tipo_evento_idTipo_evento = ?,
            Modalidad_idModalidad = ?, Fecha_y_Horarios_idFecha_y_Horarios = ?, Estado = ?,
            Capacidad_maxima = ?, Requiere_registro = ?, Fecha_creacion = ?, Fecha_actualizacion = ?
        WHERE ideventos = ?`,
        [
            data.Nombre_evento,
            data.Descripcion_evento,
            data.Tipo_evento_idTipo_evento,
            data.Modalidad_idModalidad,
            data.Fecha_y_Horarios_idFecha_y_Horarios,
            data.Estado,
            data.Capacidad_maxima,
            data.Requiere_registro,
            data.Fecha_creacion,
            data.Fecha_actualizacion,
            id
        ]
    )
    return result.affectedRows > 0
}

exports.remove = async (id) => {
    const [result] = await pool.execute(
        'DELETE FROM eventos WHERE ideventos = ?', [id]
    )
    return result.affectedRows > 0
}