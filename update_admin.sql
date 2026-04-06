-- Update admin password
UPDATE Usuarios SET Password = '$2b$10$dl4gNCLsWRImRD3b13BP2OhVijMSf1VuxlNMvBuiTr22G1JTuE2cG' WHERE idUsuarios = 1;

-- Verify
SELECT idUsuarios, Nombre, CorreoInstitucional, Password, Roles_idRoles1, Estado FROM Usuarios WHERE idUsuarios = 1;
