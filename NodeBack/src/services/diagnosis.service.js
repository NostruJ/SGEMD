const { pool } = require('../config/db.config')

exports.findAll = async () => {
    const [rows] = await pool.execute('SELECT * FROM diagnosticos')
    return rows
}

exports.findById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM diagnosticos WHERE iddiagnosticos = ?', [id])
    if (rows.length === 0) throw new Error('Diagnóstico no encontrado')
    return rows[0]
}

exports.findByEmprendimiento = async (empId) => {
    const [rows] = await pool.execute('SELECT * FROM diagnosticos WHERE Emprendimiento_idEmprendimiento = ?', [empId])
    return rows
}

exports.create = async (data) => {
    const [result] = await pool.execute(
        `INSERT INTO diagnosticos (
            FechaEmprendimiento, AreaEstrategia, Diferencial, Planeacion,
            MercadoObjetivo, Tendencias, Canales, DescripcionPromocion,
            SectorEconomico_idSectorEconomico, Emprendimiento_idEmprendimiento,
            Presentacion, PasosElaboracion, SituacionFinanciera, FuenteFinanciero,
            EstructuraOrganica, ConocimientoLegal, MetodologiaInnovacion,
            HerramientaTecnologicas, Marca, AplicacionMetodologia,
            ImpactoAmbiental, ImpactoSocial, Viabilidad
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.FechaEmprendimiento,
            data.AreaEstrategia,
            data.Diferencial,
            data.Planeacion,
            data.MercadoObjetivo,
            data.Tendencias,
            data.Canales,
            data.DescripcionPromocion,
            data.SectorEconomico_idSectorEconomico,
            data.Emprendimiento_idEmprendimiento,
            data.Presentacion,
            data.PasosElaboracion,
            data.SituacionFinanciera,
            data.FuenteFinanciero,
            data.EstructuraOrganica,
            data.ConocimientoLegal,
            data.MetodologiaInnovacion,
            data.HerramientaTecnologicas,
            data.Marca,
            data.AplicacionMetodologia,
            data.ImpactoAmbiental,
            data.ImpactoSocial,
            data.Viabilidad
        ]
    )
    return { id: result.insertId, ...data }
}

exports.update = async (id, data) => {
    const [result] = await pool.execute(
        `UPDATE diagnosticos SET
            FechaEmprendimiento = ?, AreaEstrategia = ?, Diferencial = ?, Planeacion = ?,
            MercadoObjetivo = ?, Tendencias = ?, Canales = ?, DescripcionPromocion = ?,
            SectorEconomico_idSectorEconomico = ?, Emprendimiento_idEmprendimiento = ?,
            Presentacion = ?, PasosElaboracion = ?, SituacionFinanciera = ?, FuenteFinanciero = ?,
            EstructuraOrganica = ?, ConocimientoLegal = ?, MetodologiaInnovacion = ?,
            HerramientaTecnologicas = ?, Marca = ?, AplicacionMetodologia = ?,
            ImpactoAmbiental = ?, ImpactoSocial = ?, Viabilidad = ?
        WHERE iddiagnosticos = ?`,
        [
            data.FechaEmprendimiento,
            data.AreaEstrategia,
            data.Diferencial,
            data.Planeacion,
            data.MercadoObjetivo,
            data.Tendencias,
            data.Canales,
            data.DescripcionPromocion,
            data.SectorEconomico_idSectorEconomico,
            data.Emprendimiento_idEmprendimiento,
            data.Presentacion,
            data.PasosElaboracion,
            data.SituacionFinanciera,
            data.FuenteFinanciero,
            data.EstructuraOrganica,
            data.ConocimientoLegal,
            data.MetodologiaInnovacion,
            data.HerramientaTecnologicas,
            data.Marca,
            data.AplicacionMetodologia,
            data.ImpactoAmbiental,
            data.ImpactoSocial,
            data.Viabilidad,
            id
        ]
    )
    return result.affectedRows > 0
}

exports.remove = async (id) => {
    const [result] = await pool.execute(
        'DELETE FROM diagnosticos WHERE iddiagnosticos = ?', [id]
    )
    return result.affectedRows > 0
}