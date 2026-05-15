const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        if (req.user.role !== role) {
            if (req.accepts('html')) {
                return res.status(403).send('<h1>403 Prohibido</h1><p>No tienes permiso para ver esta página.</p><a href="/">Volver</a>');
            }
            return res.status(403).json({ error: 'Acceso prohibido. Permisos insuficientes.' });
        }

        next();
    };
};

module.exports = { requireRole };
