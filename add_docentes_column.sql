-- Agregar columna Docentes_idDocentes a la tabla asesorias (si no existe)
-- Ejecutar este script en MySQL

ALTER TABLE asesorias ADD COLUMN Docentes_idDocentes INT NULL;

-- Agregar foreign key (opcional, si hay restricciones)
-- ALTER TABLE asesorias ADD CONSTRAINT fk_asesorias_docente FOREIGN KEY (Docentes_idDocentes) REFERENCES usuarios(idUsuarios);
