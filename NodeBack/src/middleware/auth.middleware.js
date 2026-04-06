// Middleware para autenticación y autorización
const jwt = require('jsonwebtoken');

// Usar la misma clave que el servicio de users (fallback coincide con users.service)
const JWT_SECRET = process.env.JWT_SECRET || 'sgemd_super_secret_key_2025';

// Verificar que el token sea válido y no haya expirado
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const cookieToken = req.cookies && req.cookies.token;

    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (cookieToken) {
        token = cookieToken;
    }

    console.log('🔍 Verificando token:', {
        authHeader: authHeader ? 'presente' : 'ausente',
        cookieToken: cookieToken ? 'presente' : 'ausente',
        tokenPresent: token ? 'sí' : 'no',
        path: req.path
    });

    if (!token) {
        console.warn('⚠️ Token ausente en:', req.path);
        return res.status(401).json({ 
            success: false, 
            error: 'Se requiere token de autenticación válido' 
        });
    }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        console.log('🔑 Token decodificado completo:', JSON.stringify(decodedToken));
        console.log('✅ Token válido para usuario:', decodedToken.id);
        // Añadir información del usuario verificado a la request
        req.user = {
            id: decodedToken.id || decodedToken.idusuarios,
            Rol: decodedToken.Rol
        };
        console.log('📌 req.user establecido:', req.user);
        next();
    } catch (err) {
        console.error('❌ Error verificando token:', err.message);
        return res.status(403).json({ 
            success: false, 
            error: 'Token inválido o expirado' 
        });
    }
};

// Roles numéricos: 1 = Admin, 2 = Estudiante, 3 = Docente
exports.isAdmin = (req, res, next) => {
    if (!req.user || typeof req.user.Rol === 'undefined' || req.user.Rol !== 1) {
        return res.status(403).json({ 
            success: false, 
            error: 'Se requieren permisos de administrador' 
        });
    }
    next();
};

exports.isTeacher = (req, res, next) => {
    if (!req.user || typeof req.user.Rol === 'undefined' || req.user.Rol !== 3) {
        return res.status(403).json({ 
            success: false, 
            error: 'Se requieren permisos de docente' 
        });
    }
    next();
};

exports.isStudent = (req, res, next) => {
    if (!req.user || typeof req.user.Rol === 'undefined' || req.user.Rol !== 2) {
        return res.status(403).json({ 
            success: false, 
            error: 'Se requieren permisos de estudiante' 
        });
    }
    next();
};