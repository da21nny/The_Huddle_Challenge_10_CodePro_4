import 'dotenv/config';
import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { xssSanitizer } from './middlewares/xssMiddleware.js';
import { generalLimiter } from './middlewares/rateLimiter.js';
import { csrfGenerator } from './middlewares/csrfMiddleware.js';
import { fileURLToPath } from 'url';

// Rutas
import authRoutes from './routes/authRoutes.js';
import indexRoutes from './routes/indexRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    secret: process.env.SESSION_SECRET,
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
app.use(csrfGenerator);  // Generar y exponer token CSRF globalmente

// Rutas
app.use('/', indexRoutes);
app.use('/auth', authRoutes);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de PassPort Inc. corriendo en http://localhost:${PORT}`);
});
