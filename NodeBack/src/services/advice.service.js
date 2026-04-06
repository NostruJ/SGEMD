const { pool } = require('../config/db.config')

exports.findAll = async (filters = {}) => {
    let query = 'SELECT * FROM asesorias WHERE 1=1';
    const params = [];
    
    if (filters.docenteId) {
        query += ' AND Docentes_idDocentes = ?';
        params.push(filters.docenteId);
    }
    
    if (filters.estudianteId) {
        query += ' AND Usuarios_idUsuarios = ?';
        params.push(filters.estudianteId);
    }
    
    const [rows] = await pool.execute(query, params);
    return rows;
}

exports.findById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM asesorias WHERE idasesorias = ?', [id]);
    if (rows.length === 0) throw new Error('Asesoría no encontrada');
    return rows[0];
}

exports.create = async (data) => {
    const fechaActual = new Date().toISOString().split('T')[0];
    const [result] = await pool.execute(
        `INSERT INTO asesorias (
            Nombre_de_asesoria, Descripcion, Fecha_asesoria, Comentarios,
            Fecha_creacion, Fecha_actualizacion, confirmacion,
            Usuarios_idUsuarios, Docentes_idDocentes, Modalidad_idModalidad, Fecha_y_Horarios_idFecha_y_Horarios
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.Nombre_de_asesoria || null,
            data.Descripcion || null,
            data.Fecha_asesoria || null,
            data.Comentarios || null,
            data.Fecha_creacion || fechaActual,
            data.Fecha_actualizacion || fechaActual,
            data.confirmacion || 'pendiente',
            data.Estudiantes_idEstudiante || data.Usuarios_idUsuarios || null,
            data.Docentes_idDocentes || null,
            data.Modalidad_idModalidad || 1,
            data.Fecha_y_Horarios_idFecha_y_Horarios || 1
        ]
    );
    return { idasesorias: result.insertId, ...data };
}

exports.update = async (id, data) => {
    let updates = [];
    let values = [];
    
    if (data.Nombre_de_asesoria !== undefined) {
        updates.push('Nombre_de_asesoria = ?');
        values.push(data.Nombre_de_asesoria);
    }
    if (data.Descripcion !== undefined) {
        updates.push('Descripcion = ?');
        values.push(data.Descripcion || null);
    }
    if (data.Fecha_asesoria !== undefined) {
        updates.push('Fecha_asesoria = ?');
        values.push(data.Fecha_asesoria);
    }
    if (data.Comentarios !== undefined) {
        updates.push('Comentarios = ?');
        values.push(data.Comentarios || null);
    }
    if (data.Fecha_actualizacion !== undefined) {
        updates.push('Fecha_actualizacion = ?');
        values.push(data.Fecha_actualizacion);
    }
    if (data.confirmacion !== undefined) {
        updates.push('confirmacion = ?');
        values.push(data.confirmacion);
    }
    if (data.Usuarios_idUsuarios !== undefined) {
        updates.push('Usuarios_idUsuarios = ?');
        values.push(data.Usuarios_idUsuarios);
    }
    if (data.Docentes_idDocentes !== undefined) {
        updates.push('Docentes_idDocentes = ?');
        values.push(data.Docentes_idDocentes);
    }
    if (data.Modalidad_idModalidad !== undefined) {
        updates.push('Modalidad_idModalidad = ?');
        values.push(data.Modalidad_idModalidad);
    }
    if (data.Fecha_y_Horarios_idFecha_y_Horarios !== undefined) {
        updates.push('Fecha_y_Horarios_idFecha_y_Horarios = ?');
        values.push(data.Fecha_y_Horarios_idFecha_y_Horarios);
    }
    
    if (updates.length === 0) return false;
    
    values.push(id);
    const [result] = await pool.execute(
        `UPDATE asesorias SET ${updates.join(', ')} WHERE idasesorias = ?`,
        values
    );
    return result.affectedRows > 0;
}

exports.remove = async (id) => {
    const [result] = await pool.execute(
        'DELETE FROM asesorias WHERE idasesorias = ?', [id]
    );
    return result.affectedRows > 0;
}
