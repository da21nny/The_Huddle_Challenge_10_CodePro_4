const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
    // 1. Check if using JWT (Authorization header or Cookie)
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt_token) {
        token = req.cookies.jwt_token;
    }

    if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
            req.user = await User.findById(decoded.id);
            if (req.user) {
                res.locals.user = req.user; // Para Handlebars
                return next();
            }
        }
    }

    // 2. Check if using Session Cookies
    if (req.session && req.session.userId) {
        const user = await User.findById(req.session.userId);
        if (user) {
            req.user = user;
            res.locals.user = user; // Para Handlebars
            return next();
        }
    }

    // Si la ruta es para web, redirigimos al login
    if (req.accepts('html')) {
        return res.redirect('/login');
    }

    // Si es una API (fetch), retornamos 401
    return res.status(401).json({ error: 'No autorizado. Inicia sesión.' });
};

module.exports = { requireAuth };
