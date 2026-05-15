const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { xssSanitizer } = require('./middlewares/xssMiddleware');
const { generalLimiter } = require('./middlewares/rateLimiter');

// Rutas
const authRoutes = require('./routes/authRoutes');
const indexRoutes = require('./routes/indexRoutes');

const app = express();

// Configuración de Motor de Plantillas Handlebars
app.engine('handlebars', engine({
    helpers: {
        eq: (a, b) => a === b
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares Globales
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para formularios HTML
app.use(cookieParser());

// Sesiones Persistentes (Cookies)
app.use(session({
    secret: process.env.SESSION_SECRET || 'passport_session_super_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true si estamos en HTTPS
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 // 1 día
    }
}));

// Protección global
app.use(generalLimiter); // Evitar DoS general
app.use(xssSanitizer);   // Escapar tags HTML del req.body

// Rutas
app.use('/', indexRoutes);
app.use('/auth', authRoutes);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de PassPort Inc. corriendo en http://localhost:${PORT}`);
    console.log(`Usuario Admin por defecto: admin@passport.inc / adminpassword`);
});
