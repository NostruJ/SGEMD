const { pool } = require('../config/db.config')

exports.findAll = async () => {
    const [rows] = await pool.execute(`
        SELECT a.*, 
               u_est.Nombre as EstudianteNombre, 
               u_est.CorreoInstitucional as EstudianteCorreo,
               u_ment.Nombre as MentorNombre,
               u_ment.CorreoInstitucional as MentorCorreo,
               e.Nombre as EmprendimientoNombre
        FROM asignaciones a
        LEFT JOIN usuarios u_est ON a.Usuarios_idEstudiante = u_est.idUsuarios
        LEFT JOIN usuarios u_ment ON a.Usuarios_idMentor = u_ment.idUsuarios
        LEFT JOIN emprendimiento e ON a.Emprendimiento_idEmprendimiento = e.idEmprendimiento
    `)
    return rows
}

exports.findById = async (id) => {
    const [rows] = await pool.execute(`
        SELECT a.*, 
               u_est.Nombre as EstudianteNombre, 
               u_est.CorreoInstitucional as EstudianteCorreo,
               u_ment.Nombre as MentorNombre,
               u_ment.CorreoInstitucional as MentorCorreo,
               e.Nombre as EmprendimientoNombre
        FROM asignaciones a
        LEFT JOIN usuarios u_est ON a.Usuarios_idEstudiante = u_est.idUsuarios
        LEFT JOIN usuarios u_ment ON a.Usuarios_idMentor = u_ment.idUsuarios
        LEFT JOIN emprendimiento e ON a.Emprendimiento_idEmprendimiento = e.idEmprendimiento
        WHERE a.idAsignacion = ?
    `, [id])
    if (rows.length === 0) throw new Error('Asignación no encontrada')
    return rows[0]
}

exports.findByMentor = async (mentorId) => {
    const [rows] = await pool.execute(`
        SELECT a.*, 
               u_est.Nombre as EstudianteNombre, 
               u_est.CorreoInstitucional as EstudianteCorreo,
               u_est.Celular as EstudianteCelular,
               e.Nombre as EmprendimientoNombre,
               e.Descripcion as EmprendimientoDescripcion,
               et.Etapa as EtapaNombre
        FROM asignaciones a
        INNER JOIN usuarios u_est ON a.Usuarios_idEstudiante = u_est.idUsuarios
        LEFT JOIN emprendimiento e ON a.Emprendimiento_idEmprendimiento = e.idEmprendimiento
        LEFT JOIN etapaemprendimiento et ON e.EtapaEmprendimiento_idEtapaEmprendimiento = et.idEtapaEmprendimiento
        WHERE a.Usuarios_idMentor = ? AND a.Estado = 'activa'
    `, [mentorId])
    return rows
}

exports.findByEstudiante = async (estudianteId) => {
    const [rows] = await pool.execute(`
        SELECT a.*, 
               u_ment.Nombre as MentorNombre,
               u_ment.CorreoInstitucional as MentorCorreo,
               e.Nombre as EmprendimientoNombre
        FROM asignaciones a
        INNER JOIN usuarios u_ment ON a.Usuarios_idMentor = u_ment.idUsuarios
        LEFT JOIN emprendimiento e ON a.Emprendimiento_idEmprendimiento = e.idEmprendimiento
        WHERE a.Usuarios_idEstudiante = ? AND a.Estado = 'activa'
    `, [estudianteId])
    return rows
}

exports.create = async (data) => {
    const fechaActual = new Date()
    const [result] = await pool.execute(
        `INSERT INTO asignaciones (Usuarios_idMentor, Usuarios_idEstudiante, Emprendimiento_idEmprendimiento, FechaAsignacion, Estado) VALUES (?, ?, ?, ?, ?)`,
        [
            data.Usuarios_idMentor,
            data.Usuarios_idEstudiante,
            data.Emprendimiento_idEmprendimiento || null,
            fechaActual,
            data.Estado || 'activa'
        ]
    )
    return { id: result.insertId, ...data }
}

exports.update = async (id, data) => {
    const [result] = await pool.execute(
        `UPDATE asignaciones SET 
            Usuarios_idMentor = ?,
            Emprendimiento_idEmprendimiento = ?,
            Estado = ?
        WHERE idAsignacion = ?`,
        [
            data.Usuarios_idMentor,
            data.Emprendimiento_idEmprendimiento,
            data.Estado,
            id
        ]
    )
    return result.affectedRows > 0
}

exports.remove = async (id) => {
    const [result] = await pool.execute(
        'UPDATE asignaciones SET Estado = "inactiva" WHERE idAsignacion = ?',
        [id]
    )
    return result.affectedRows > 0
}