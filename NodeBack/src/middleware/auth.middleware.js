// Middleware para autenticación y autorización
const jwt = require('jsonwebtoken');

// JWT_SECRET debe estar configurado en variables de entorno
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET es requerido en variables de entorno');
}
const JWT_SECRET = process.env.JWT_SECRET;

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
        return res.status(401).json({ 
            success: false, 
            error: 'Se requiere token de autenticación válido' 
        });
    }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        
        // Mapear rol del token (soporta formato nuevo y antiguo)
        let rolId = decodedToken.rolId || decodedToken.Roles_idRoles1;
        
        // Si rolId sigue siendo undefined o es string, inferir del nombre del rol
        if (!rolId || typeof rolId === 'string') {
            const rolString = decodedToken.Rol || decodedToken.role || '';
            if (rolString === 'Administrador' || rolString === 'Admin') rolId = 1;
            else if (rolString === 'Estudiante') rolId = 2;
            else if (rolString === 'Docente' || rolString === 'Maestro') rolId = 3;
            else rolId = parseInt(rolString) || null;
        }
        
        // Añadir información del usuario verificado a la request
        req.user = {
            id: decodedToken.id || decodedToken.idusuarios,
            idusuarios: decodedToken.id || decodedToken.idusuarios,
            Rol: decodedToken.role || decodedToken.Rol,
            Roles_idRoles1: rolId
        };
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