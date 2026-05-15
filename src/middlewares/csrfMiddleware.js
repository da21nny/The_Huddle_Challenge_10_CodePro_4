const crypto = require('crypto');

// Middleware para generar y proveer el token CSRF a las vistas
const csrfGenerator = (req, res, next) => {
    // Si la sesión no tiene un token CSRF, lo generamos
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    
    // Lo exponemos a Handlebars
    res.locals.csrfToken = req.session.csrfToken;
    next();
};

// Middleware para validar el token en peticiones que cambian el estado
const csrfValidator = (req, res, next) => {
    // Solo validamos peticiones que no sean GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const tokenFromReq = req.body._csrf || req.headers['x-csrf-token'];
    
    if (!tokenFromReq || tokenFromReq !== req.session.csrfToken) {
        return res.status(403).send('Error CSRF: Token inválido o ausente.');
    }

    next();
};

module.exports = { csrfGenerator, csrfValidator };
