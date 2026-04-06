-- Tabla de Tareas para SGEMD
-- Ejecutar este script para agregar la funcionalidad de tareas

USE db_segmed;

-- Tabla de tareas
CREATE TABLE IF NOT EXISTS tareas (
    idTareas INT NOT NULL AUTO_INCREMENT,
    Titulo VARCHAR(200) NOT NULL,
    Descripcion TEXT,
    FechaLimite DATE NOT NULL,
    Estado ENUM('pendiente', 'completada', 'vencida') DEFAULT 'pendiente',
    Emprendimiento_idEmprendimiento INT NOT NULL,
    Usuario_idUsuarios INT NOT NULL,
    Docentes_idDocentes INT,
    FechaCreacion DATE NOT NULL,
    FechaActualizacion DATE NOT NULL,
    PRIMARY KEY (idTareas),
    FOREIGN KEY (Emprendimiento_idEmprendimiento) REFERENCES emprendimiento(idEmprendimiento),
    FOREIGN KEY (Usuario_idUsuarios) REFERENCES usuarios(idUsuarios)
);

-- Tabla para almacenar notas/anotaciones del diagnóstico
CREATE TABLE IF NOT EXISTS diagnostico_notas (
    idNota INT NOT NULL AUTO_INCREMENT,
    Diagnostico_idDiagnosticos INT NOT NULL,
    Usuario_idUsuarios INT NOT NULL,
    Nota TEXT NOT NULL,
    Tipo ENUM('admin', 'docente') NOT NULL,
    FechaCreacion DATE NOT NULL,
    PRIMARY KEY (idNota),
    FOREIGN KEY (Diagnostico_idDiagnosticos) REFERENCES diagnosticos(idDiagnosticos),
    FOREIGN KEY (Usuario_idUsuarios) REFERENCES usuarios(idUsuarios)
);

-- Tabla de asignación de emprendimientos (para múltiples docentes/estudiantes)
CREATE TABLE IF NOT EXISTS emprendimiento_usuarios (
    id INT NOT NULL AUTO_INCREMENT,
    Emprendimiento_idEmprendimiento INT NOT NULL,
    Usuario_idUsuarios INT NOT NULL,
    Rol ENUM('estudiante', 'docente') NOT NULL,
    FechaAsignacion DATE NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (Emprendimiento_idEmprendimiento) REFERENCES emprendimiento(idEmprendimiento),
    FOREIGN KEY (Usuario_idUsuarios) REFERENCES usuarios(idUsuarios),
    UNIQUE KEY unique_asignacion (Emprendimiento_idEmprendimiento, Usuario_idUsuarios, Rol)
);
