const { pool } = require('../config/db.config')

exports.findAll = async () => {
    const [rows] = await pool.execute('SELECT * FROM eventos')
    return rows
}

exports.findById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM eventos WHERE idEventos = ?', [id])
    if (rows.length === 0) throw new Error('Evento no encontrado')
    return rows[0]
}

exports.create = async (data) => {
    const [result] = await pool.execute(
        `INSERT INTO eventos (
            Nombre_evento, Descripcion_evento, Tipo_evento_idTipo_evento,
            Modalidad_idModalidad, Fecha_y_Horarios_idFecha_y_Horarios, Estado,
            Capacidad_maxima, Requiere_registro, Fecha_creacion, Fecha_actualizacion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.Nombre || data.Nombre_evento,
            data.Descripcion || data.Descripcion_evento,
            data.Tipo || data.Tipo_evento_idTipo_evento || 1,
            data.Modalidad || data.Modalidad_idModalidad || 1,
            data.Fecha_y_Horarios_idFecha_y_Horarios || 1,
            data.Estado || 'activo',
            data.Capacidad_maxima || data.Capacidad || 50,
            data.Requiere_registro || 1,
            new Date(),
            new Date()
        ]
    )
    return { id: result.insertId, ...data }
}

exports.update = async (id, data) => {
    const updates = [];
    const values = [];
    
    if (data.Nombre || data.Nombre_evento) {
        updates.push('Nombre_evento = ?');
        values.push(data.Nombre || data.Nombre_evento);
    }
    if (data.Descripcion || data.Descripcion_evento) {
        updates.push('Descripcion_evento = ?');
        values.push(data.Descripcion || data.Descripcion_evento);
    }
    if (data.Tipo || data.Tipo_evento_idTipo_evento) {
        updates.push('Tipo_evento_idTipo_evento = ?');
        values.push(data.Tipo || data.Tipo_evento_idTipo_evento);
    }
    if (data.Modalidad || data.Modalidad_idModalidad) {
        updates.push('Modalidad_idModalidad = ?');
        values.push(data.Modalidad || data.Modalidad_idModalidad);
    }
    if (data.Estado) {
        updates.push('Estado = ?');
        values.push(data.Estado);
    }
    if (data.Capacidad_maxima || data.Capacidad) {
        updates.push('Capacidad_maxima = ?');
        values.push(data.Capacidad_maxima || data.Capacidad);
    }
    if (data.Requiere_registro !== undefined) {
        updates.push('Requiere_registro = ?');
        values.push(data.Requiere_registro);
    }
    
    updates.push('Fecha_actualizacion = ?');
    values.push(new Date());
    values.push(id);
    
    const [result] = await pool.execute(
        `UPDATE eventos SET ${updates.join(', ')} WHERE idEventos = ?`,
        values
    )
    return result.affectedRows > 0
}

exports.remove = async (id) => {
    const [result] = await pool.execute(
        'DELETE FROM eventos WHERE idEventos = ?', [id]
    )
    return result.affectedRows > 0
}