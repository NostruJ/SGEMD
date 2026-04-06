-- Script para verificar y activar usuarios en la base de datos

USE db_segmed;

-- Ver todos los usuarios actuales
SELECT idUsuarios, Nombre, CorreoInstitucional, Estado, Roles_idRoles1 FROM usuarios;

-- Activar todos los usuarios
UPDATE usuarios SET Estado = 1 WHERE Estado = 0 OR Estado IS NULL;

-- Crear admin si no existe
INSERT INTO usuarios (Nombre, CorreoInstitucional, Password, Verificado, Roles_idRoles1, Estado, FechaCreacion, FechaActualizacion)
SELECT 'Administrador SGEMD', 'admin@sgemd.com', '$2b$10$dl4gNCLsWRImRD3b13BP2OhVijMSf1VuxlNMvBuiTr22G1JTuE2cG', 1, 1, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE CorreoInstitucional = 'admin@sgemd.com');

-- Confirmar cambios
SELECT idUsuarios, Nombre, CorreoInstitucional, Estado, Roles_idRoles1 FROM usuarios;
