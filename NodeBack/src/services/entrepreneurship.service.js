const { pool } = require('../config/db.config')

exports.findAll = async () => {
    const [rows] = await pool.execute('SELECT * FROM emprendimiento')
    return rows
};

exports.findById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM emprendimiento WHERE idemprendimiento = ?', [id]);
    if (rows.length === 0) throw new Error('emprendimiento no encontrado');
    return rows[0]
}

exports.create = async (data) => {
    const fechaActual = new Date().toISOString().split('T')[0];
    console.log('[entrepreneurship.service] Datos recibidos:', data);
    console.log('[entrepreneurship.service] Fecha actual:', fechaActual);
    
    // Normalizar valores undefined a null
    const nombre = data.Nombre !== undefined ? data.Nombre : null;
    const descripcion = data.Descripcion !== undefined ? data.Descripcion : null;
    const tipoEmprendimiento = (data.TipoEmprendimiento || data.Tipoemprendimiento) !== undefined 
        ? (data.TipoEmprendimiento || data.Tipoemprendimiento) 
        : null;
    const sectorProductivo = data.SectorProductivo !== undefined ? data.SectorProductivo : null;
    const redesSociales = data.RedesSociales !== undefined ? data.RedesSociales : 0;
    const acompanamiento = data.Acompanamiento !== undefined ? data.Acompanamiento : 0;
    const etapaId = data.EtapaEmprendimiento_idEtapaEmprendimiento || data.Etapaemprendimiento_idEtapaemprendimiento || 1;
    const usuarioId = data.Usuarios_idUsuarios !== undefined ? data.Usuarios_idUsuarios : null;
    const actaCompromiso = data.ActaCompromiso !== undefined ? data.ActaCompromiso : null;
    
    try {
        const [result] = await pool.execute(
            `INSERT INTO emprendimiento (
                Nombre, Descripcion, TipoEmprendimiento, SectorProductivo,
                RedesSociales, Acompanamiento, FechaCreacion, FechaActualizacion,
                ActaCompromiso, EtapaEmprendimiento_idEtapaEmprendimiento, Usuarios_idUsuarios
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nombre,
                descripcion,
                tipoEmprendimiento,
                sectorProductivo,
                redesSociales,
                acompanamiento,
                fechaActual,
                fechaActual,
                actaCompromiso,
                etapaId,
                usuarioId
            ]
        )
        console.log('[entrepreneurship.service] Insert exitoso, ID:', result.insertId);
        return { idEmprendimiento: result.insertId, ...data }
    } catch (error) {
        console.error('[entrepreneurship.service] Error en INSERT:', error.message);
        throw error;
    }
}

exports.update = async (id, data) => {
    const fechaActual = new Date().toISOString().split('T')[0];
    const [result] = await pool.execute(
        `UPDATE emprendimiento SET
            Nombre = ?, Descripcion = ?, TipoEmprendimiento = ?, SectorProductivo = ?,
            RedesSociales = ?, Acompanamiento = ?, FechaActualizacion = ?,
            ActaCompromiso = ?, EtapaEmprendimiento_idEtapaEmprendimiento = ?
        WHERE idemprendimiento = ?`,
        [
            data.Nombre || null,
            data.Descripcion || null,
            data.TipoEmprendimiento || data.Tipoemprendimiento || null,
            data.SectorProductivo || null,
            data.RedesSociales || 0,
            data.Acompanamiento || 0,
            fechaActual,
            data.ActaCompromiso || null,
            data.EtapaEmprendimiento_idEtapaEmprendimiento || data.Etapaemprendimiento_idEtapaemprendimiento || 1,
            id
        ]
    )
    return result.affectedRows > 0;
}

exports.remove = async (id) => {
    const [result] = await pool.execute(
        'DELETE FROM emprendimiento WHERE idemprendimiento = ?', [id]
    )
    return result.affectedRows > 0;
}