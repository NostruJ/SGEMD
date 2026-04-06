-- SGEMD Database Initialization Script
-- Ejecutar este script después de crear la base de datos

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS db_segmed;
USE db_segmed;

-- =============================================
-- TABLAS DE CATÁLOGO
-- =============================================

-- Roles
CREATE TABLE IF NOT EXISTS roles (
    idRoles INT NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(45) NOT NULL,
    FechaCreacion DATE NOT NULL,
    FechaActualizacion DATE NOT NULL,
    PRIMARY KEY (idRoles)
);

-- Insertar roles por defecto
INSERT INTO roles (idRoles, Nombre, FechaCreacion, FechaActualizacion) VALUES 
(1, 'Administrador', NOW(), NOW()),
(2, 'Estudiante', NOW(), NOW()),
(3, 'Maestro', NOW(), NOW());

-- TipoDocumentos
CREATE TABLE IF NOT EXISTS tipodocumentos (
    idTipoDocumento INT NOT NULL AUTO_INCREMENT,
    TipoDocumento VARCHAR(45) NOT NULL,
    FechaCreacion DATE NOT NULL,
    FechaActualizacion DATE NOT NULL,
    PRIMARY KEY (idTipoDocumento)
);

INSERT INTO tipodocumentos (TipoDocumento, FechaCreacion, FechaActualizacion) VALUES
('Cédula de Ciudadanía', NOW(), NOW()),
('Cédula de Extranjería', NOW(), NOW()),
('Pasaporte', NOW(), NOW()),
('Tarjeta de Identidad', NOW(), NOW());

-- ProgramaAcademico
CREATE TABLE IF NOT EXISTS programaacademico (
    idProgramaAcademico INT NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    FechaCreacion DATE NOT NULL,
    FechaActualizacion DATE NOT NULL,
    PRIMARY KEY (idProgramaAcademico)
);

INSERT INTO programaacademico (Nombre, FechaCreacion, FechaActualizacion) VALUES
('Administración de Empresas', NOW(), NOW()),
('Contaduría Pública', NOW(), NOW()),
('Ingeniería de Sistemas', NOW(), NOW()),
('Ingeniería Industrial', NOW(), NOW()),
('Trabajo Social', NOW(), NOW()),
('Licenciatura en Educación Infantil', NOW(), NOW()),
('Negocios Internacionales', NOW(), NOW()),
('Comunicación Social', NOW(), NOW());

-- CentroUniversitarios
CREATE TABLE IF NOT EXISTS centrouniversitarios (
    idCentroUniversitarios INT NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    FechaCreacion DATE NOT NULL,
    FechaActualizacion DATE NOT NULL,
    PRIMARY KEY (idCentroUniversitarios)
);

INSERT INTO centrouniversitarios (Nombre, FechaCreacion, FechaActualizacion) VALUES
('UNIMINUTO chicalá - Ibagué', NOW(), NOW());

-- TipoUsuarios
CREATE TABLE IF NOT EXISTS tipousuarios (
    idTipoUsuarios INT NOT NULL,
    TipodeUsuario VARCHAR(45) NOT NULL,
    FechaCreacion DATE NOT NULL,
    FechaActualizacion DATE NOT NULL,
    PRIMARY KEY (idTipoUsuarios)
);

INSERT INTO tipousuarios (idTipoUsuarios, TipodeUsuario, FechaCreacion, FechaActualizacion) VALUES
(1, 'Estudiante', NOW(), NOW()),
(2, 'Egresado', NOW(), NOW()),
(3, 'Docente', NOW(), NOW()),
(4, 'Administrativo', NOW(), NOW());

-- TipoPoblacion
CREATE TABLE IF NOT EXISTS tipopoblacion (
    idTipoPoblacion INT NOT NULL,
    Nombre VARCHAR(45) NOT NULL,
    FechaCreacion DATE NOT NULL,
    FechaActualizacion DATE NOT NULL,
    PRIMARY KEY (idTipoPoblacion)
);

INSERT INTO tipopoblacion (idTipoPoblacion, Nombre, FechaCreacion, FechaActualizacion) VALUES
(1, 'Víctima del conflicto', NOW(), NOW()),
(2, 'Discapacidad', NOW(), NOW()),
(3, 'Población indígena', NOW(), NOW()),
(4, 'Afrodescendiente', NOW(), NOW()),
(5, 'None', NOW(), NOW());

-- Municipios
CREATE TABLE IF NOT EXISTS municipios (
    idMunicipio INT NOT NULL,
    Nombre VARCHAR(45) NOT NULL,
    FechaCreacion DATE NOT NULL,
    FechaActualizacion DATE NOT NULL,
    PRIMARY KEY (idMunicipio)
);

INSERT INTO municipios (idMunicipio, Nombre, FechaCreacion, FechaActualizacion) VALUES
(1, 'Ibagué', NOW(), NOW()),
(2, 'Cali', NOW(), NOW()),
(3, 'Bogotá', NOW(), NOW()),
(4, 'Medellín', NOW(), NOW()),
(5, 'Pereira', NOW(), NOW()),
(6, 'Manizales', NOW(), NOW()),
(7, 'Armenia', NOW(), NOW()),
(8, 'Neiva', NOW(), NOW());

-- Modulos
CREATE TABLE IF NOT EXISTS modulos (
    idModulos INT NOT NULL AUTO_INCREMENT,
    Asistencia VARCHAR(45) NOT NULL,
    Practicas VARCHAR(45) NOT NULL,
    OpcionGrado VARCHAR(45) NOT NULL,
    FechaCreacion DATE NOT NULL,
    FechaActualizacion DATE NOT NULL,
    PRIMARY KEY (idModulos)
);

-- =============================================
-- TABLAS PRINCIPALES
-- =============================================

-- Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    idUsuarios INT NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    CorreoInstitucional VARCHAR(100) NOT NULL UNIQUE,
    CorreoPersonal VARCHAR(100),
    Verificado TINYINT(1) NOT NULL DEFAULT 0,
    Password VARCHAR(255) NOT NULL,
    Celular VARCHAR(20),
    Telefono VARCHAR(20),
    Direccion VARCHAR(100),
    Genero VARCHAR(20),
    EstadoCivil VARCHAR(20),
    FechaNacimiento DATE,
    Modulos_idModulos INT,
    Municipios_idMunicipio INT,
    ProgramaAcademico_idProgramaAcademico INT,
    Roles_idRoles1 INT,
    TipoDocumentos_idTipoDocumento INT,
    TipoUsuarios_idTipoUsuarios INT,
    ProgramaAcademico_idProgramaAcademico1 INT,
    CentroUniversitarios_idCentroUniversitarios INT,
    Estado TINYINT NOT NULL DEFAULT 1,
    Semestre VARCHAR(20),
    Modalidad VARCHAR(20),
    TipoPoblacion_idTipoPoblacion INT,
    FechaCreacion DATE,
    FechaActualizacion DATE,
    img_perfil VARCHAR(255),
    PRIMARY KEY (idUsuarios),
    FOREIGN KEY (Roles_idRoles1) REFERENCES roles(idRoles),
    FOREIGN KEY (ProgramaAcademico_idProgramaAcademico) REFERENCES programaacademico(idProgramaAcademico),
    FOREIGN KEY (CentroUniversitarios_idCentroUniversitarios) REFERENCES centrouniversitarios(idCentroUniversitarios),
    FOREIGN KEY (Municipios_idMunicipio) REFERENCES municipios(idMunicipio),
    FOREIGN KEY (TipoDocumentos_idTipoDocumento) REFERENCES tipodocumentos(idTipoDocumento),
    FOREIGN KEY (TipoUsuarios_idTipoUsuarios) REFERENCES tipousuarios(idTipoUsuarios),
    FOREIGN KEY (TipoPoblacion_idTipoPoblacion) REFERENCES tipopoblacion(idTipoPoblacion)
);

-- Usuario Administrador por defecto (password: Admin2024!)
INSERT INTO usuarios (Nombre, CorreoInstitucional, Password, Verificado, Roles_idRoles1, Estado, FechaCreacion, FechaActualizacion)
VALUES ('Administrador SGEMD', 'admin@sgemd.com', '$2b$10$dl4gNCLsWRImRD3b13BP2OhVijMSf1VuxlNMvBuiTr22G1JTuE2cG', 1, 1, 1, NOW(), NOW());

-- EtapaEmprendimiento
CREATE TABLE IF NOT EXISTS etapaemprendimiento (
    idEtapaEmprendimiento INT NOT NULL AUTO_INCREMENT,
    Estado TINYINT NOT NULL,
    FechaCreacion DATE NOT NULL,
    FechaActualizacion DATE NOT NULL,
    TipoEtapa VARCHAR(45) NOT NULL,
    PRIMARY KEY (idEtapaEmprendimiento)
);

INSERT INTO etapaemprendimiento (Estado, FechaCreacion, FechaActualizacion, TipoEtapa) VALUES
(1, NOW(), NOW(), 'Ideación'),
(1, NOW(), NOW(), 'Prototipado'),
(1, NOW(), NOW(), 'Validación'),
(1, NOW(), NOW(), 'Lanzamiento');

-- SectorEconomico
CREATE TABLE IF NOT EXISTS sectoreconomico (
    idSectorEconomico INT NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    PRIMARY KEY (idSectorEconomico)
);

INSERT INTO sectoreconomico (Nombre) VALUES
('Agricultura y ganadería'),
('Comercio al por menor'),
('Industria manufacturera'),
('Servicios de alimentación'),
('Tecnología de la información'),
('Educación'),
('Salud'),
('Construcción'),
('Transporte'),
('Otros servicios');

-- Emprendimiento
CREATE TABLE IF NOT EXISTS emprendimiento (
    idEmprendimiento INT NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    TipoEmprendimiento VARCHAR(50),
    SectorProductivo VARCHAR(50),
    RedesSociales TINYINT DEFAULT 0,
    Acompanamiento TINYINT DEFAULT 0,
    ActaCompromiso TEXT,
    FechaCreacion DATE NOT NULL,
    FechaActualizacion DATE NOT NULL,
    EtapaEmprendimiento_idEtapaEmprendimiento INT,
    Usuarios_idUsuarios INT,
    PRIMARY KEY (idEmprendimiento),
    FOREIGN KEY (EtapaEmprendimiento_idEtapaEmprendimiento) REFERENCES etapaemprendimiento(idEtapaEmprendimiento),
    FOREIGN KEY (Usuarios_idUsuarios) REFERENCES usuarios(idUsuarios)
);

-- Seguimientos
CREATE TABLE IF NOT EXISTS seguimientos (
    idSeguimientos INT NOT NULL AUTO_INCREMENT,
    histproal VARCHAR(45),
    TipoSeguimiento VARCHAR(45),
    Descripcion TEXT,
    SeguimientoCol TEXT,
    FechaCreacion DATE NOT NULL,
    FechaActualizacion DATE NOT NULL,
    PRIMARY KEY (idSeguimientos)
);

-- Asistencia
CREATE TABLE IF NOT EXISTS asistencia (
    idAsistencia INT NOT NULL AUTO_INCREMENT,
    FeedBack VARCHAR(45),
    FechaCreacion DATE NOT NULL,
    FechaActualizacion DATE NOT NULL,
    Emprendimiento_idEmprendimiento INT,
    Seguimientos_idSeguimientos INT,
    PRIMARY KEY (idAsistencia),
    FOREIGN KEY (Emprendimiento_idEmprendimiento) REFERENCES emprendimiento(idEmprendimiento),
    FOREIGN KEY (Seguimientos_idSeguimientos) REFERENCES seguimientos(idSeguimientos)
);

-- Diagnosticos
CREATE TABLE IF NOT EXISTS diagnosticos (
    idDiagnosticos INT NOT NULL AUTO_INCREMENT,
    FechaEmprendimiento DATE,
    AreaEstrategia VARCHAR(45),
    Diferencial TINYINT,
    Planeacion TINYINT,
    MercadoObjetivo VARCHAR(45),
    Tendencias TINYINT,
    Canales TINYINT,
    DescripcionPromocion TEXT,
    SectorEconomico_idSectorEconomico INT,
    Emprendimiento_idEmprendimiento INT,
    Presentacion TINYINT,
    PasosElaboracion TINYINT,
    SituacionFinanciera TINYINT,
    FuenteFinanciero TEXT,
    EstructuraOrganica TINYINT,
    ConocimientoLegal TINYINT,
    MetodologiaInnovacion TEXT,
    HerramientaTecnologicas TEXT,
    Marca TEXT,
    AplicacionMetodologia TINYINT,
    ImpactoAmbiental TINYINT,
    ImpactoSocial TINYINT,
    Viabilidad TINYINT,
    PRIMARY KEY (idDiagnosticos),
    FOREIGN KEY (SectorEconomico_idSectorEconomico) REFERENCES sectoreconomico(idSectorEconomico),
    FOREIGN KEY (Emprendimiento_idEmprendimiento) REFERENCES emprendimiento(idEmprendimiento)
);

-- Modalidad
CREATE TABLE IF NOT EXISTS modalidad (
    idModalidad INT NOT NULL,
    Presencial TINYINT NOT NULL,
    Distancia TINYINT NOT NULL,
    Enlace_virtual VARCHAR(100),
    Lugar VARCHAR(100),
    PRIMARY KEY (idModalidad)
);

INSERT INTO modalidad (idModalidad, Presencial, Distancia, Enlace_virtual, Lugar) VALUES
(1, 1, 0, '', 'Campus UNIMINUTO chicalá'),
(2, 0, 1, 'https://meet.google.com/sgemd-asesoria', '');

-- Fecha_y_Horarios
CREATE TABLE IF NOT EXISTS fecha_y_Horarios (
    idFecha_y_Horarios INT NOT NULL,
    Fecha_inicio DATETIME NOT NULL,
    Hora_inicio DATETIME NOT NULL,
    Fecha_fin DATETIME NOT NULL,
    Hora_fin DATETIME NOT NULL,
    PRIMARY KEY (idFecha_y_Horarios)
);

-- Asesorias
CREATE TABLE IF NOT EXISTS asesorias (
    idAsesorias INT NOT NULL AUTO_INCREMENT,
    Nombre_de_asesoria VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Fecha_asesoria DATETIME NOT NULL,
    Comentarios TEXT,
    Fecha_creacion DATETIME NOT NULL,
    Fecha_actualizacion DATETIME NOT NULL,
    confirmacion VARCHAR(20) DEFAULT 'pendiente',
    Usuarios_idUsuarios INT NOT NULL,
    Docentes_idDocentes INT,
    Modalidad_idModalidad INT NOT NULL,
    Fecha_y_Horarios_idFecha_y_Horarios INT NOT NULL,
    PRIMARY KEY (idAsesorias),
    FOREIGN KEY (Usuarios_idUsuarios) REFERENCES usuarios(idUsuarios),
    FOREIGN KEY (Docentes_idDocentes) REFERENCES usuarios(idUsuarios),
    FOREIGN KEY (Modalidad_idModalidad) REFERENCES modalidad(idModalidad),
    FOREIGN KEY (Fecha_y_Horarios_idFecha_y_Horarios) REFERENCES fecha_y_Horarios(idFecha_y_Horarios)
);

-- Tipo_evento
CREATE TABLE IF NOT EXISTS tipo_evento (
    idTipo_evento INT NOT NULL,
    Academico VARCHAR(45) NOT NULL,
    Cultura VARCHAR(45) NOT NULL,
    Deportivo VARCHAR(45) NOT NULL,
    Social VARCHAR(45) NOT NULL,
    Conferencia VARCHAR(45) NOT NULL,
    PRIMARY KEY (idTipo_evento)
);

INSERT INTO tipo_evento (idTipo_evento, Academico, Cultura, Deportivo, Social, Conferencia) VALUES
(1, 1, 0, 0, 0, 0),
(2, 0, 1, 0, 0, 0),
(3, 0, 0, 1, 0, 0),
(4, 0, 0, 0, 1, 0),
(5, 0, 0, 0, 0, 1);

-- Eventos
CREATE TABLE IF NOT EXISTS eventos (
    idEventos INT NOT NULL,
    Nombre_evento VARCHAR(100) NOT NULL,
    Descripcion_evento TEXT,
    Tipo_evento_idTipo_evento INT NOT NULL,
    Modalidad_idModalidad INT NOT NULL,
    Fecha_y_Horarios_idFecha_y_Horarios INT NOT NULL,
    Estado VARCHAR(20) DEFAULT 'activo',
    Capacidad_maxima INT DEFAULT 50,
    Requiere_registro TINYINT DEFAULT 1,
    Fecha_creacion DATETIME NOT NULL,
    Fecha_actualizacion DATETIME NOT NULL,
    PRIMARY KEY (idEventos),
    FOREIGN KEY (Tipo_evento_idTipo_evento) REFERENCES tipo_evento(idTipo_evento),
    FOREIGN KEY (Modalidad_idModalidad) REFERENCES modalidad(idModalidad),
    FOREIGN KEY (Fecha_y_Horarios_idFecha_y_Horarios) REFERENCES fecha_y_Horarios(idFecha_y_Horarios)
);

-- Usuarios_has_Eventos
CREATE TABLE IF NOT EXISTS usuarios_has_Eventos (
    Usuarios_idUsuarios INT NOT NULL,
    Eventos_idEventos INT NOT NULL,
    Estado_asistencia VARCHAR(20) DEFAULT 'pendiente',
    PRIMARY KEY (Usuarios_idUsuarios, Eventos_idEventos),
    FOREIGN KEY (Usuarios_idUsuarios) REFERENCES usuarios(idUsuarios),
    FOREIGN KEY (Eventos_idEventos) REFERENCES eventos(idEventos)
);

-- Tabla para almacenar códigos de verificación
CREATE TABLE IF NOT EXISTS codigosverificacion (
    idCodigo INT NOT NULL AUTO_INCREMENT,
    CorreoInstitucional VARCHAR(100) NOT NULL,
    Codigo VARCHAR(10) NOT NULL,
    Expiracion DATETIME NOT NULL,
    Usado TINYINT DEFAULT 0,
    PRIMARY KEY (idCodigo)
);

-- Tabla para relación docente-estudiante (asignaciones)
CREATE TABLE IF NOT EXISTS asignaciones (
    idAsignacion INT NOT NULL AUTO_INCREMENT,
    Usuarios_idMentor INT NOT NULL,
    Usuarios_idEstudiante INT NOT NULL,
    Emprendimiento_idEmprendimiento INT,
    FechaAsignacion DATE NOT NULL,
    Estado VARCHAR(20) DEFAULT 'activa',
    PRIMARY KEY (idAsignacion),
    FOREIGN KEY (Usuarios_idMentor) REFERENCES usuarios(idUsuarios),
    FOREIGN KEY (Usuarios_idEstudiante) REFERENCES usuarios(idUsuarios),
    FOREIGN KEY (Emprendimiento_idEmprendimiento) REFERENCES emprendimiento(idEmprendimiento)
);

-- Tabla para evaluación de habilidades
CREATE TABLE IF NOT EXISTS evaluacioneshabilidades (
    idEvaluacion INT NOT NULL AUTO_INCREMENT,
    Usuarios_idEstudiante INT NOT NULL,
    Usuarios_idMaestro INT NOT NULL,
    ModeladoNegocios INT DEFAULT 0,
    PensamientoCreativo INT DEFAULT 0,
    GestionRecursos INT DEFAULT 0,
    CapacidadEjecucion INT DEFAULT 0,
    ComunicacionEmpresarial INT DEFAULT 0,
    Observaciones TEXT,
    FechaEvaluacion DATE NOT NULL,
    PRIMARY KEY (idEvaluacion),
    FOREIGN KEY (Usuarios_idEstudiante) REFERENCES usuarios(idUsuarios),
    FOREIGN KEY (Usuarios_idMaestro) REFERENCES usuarios(idUsuarios)
);

-- Tabla para solicitudes de tutoría
CREATE TABLE IF NOT EXISTS solicitudestutoria (
    idSolicitud INT NOT NULL AUTO_INCREMENT,
    Usuarios_idEstudiante INT NOT NULL,
    Tema VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    FechaPreferida DATE,
    Modalidad VARCHAR(20),
    Estado VARCHAR(20) DEFAULT 'pendiente',
    FechaSolicitud DATE NOT NULL,
    PRIMARY KEY (idSolicitud),
    FOREIGN KEY (Usuarios_idEstudiante) REFERENCES usuarios(idUsuarios)
);

SELECT '✅ Base de datos SGEMD inicializada correctamente' AS Mensaje;
