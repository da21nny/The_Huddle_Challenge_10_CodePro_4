import 'dotenv/config';
import express from 'express';
import { engine } from 'express-handlebars';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { initDb } from './config/database.js';
import { sanitize } from './middlewares/sanitizer.js';
import { generateCsrfToken, validateCsrfToken } from './middlewares/csrfMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// View engine setup
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: { eq: (a, b) => a === b }
}));
app.set('view engine', 'hbs');
app.set('views', './views');

// Middlewares
app.use(helmet());
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sanitize);
app.use(generateCsrfToken);
app.use(validateCsrfToken);

// Routes
app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/', adminRoutes);
app.get('/', (req, res) => res.redirect('/login'));

// Start
const PORT = process.env.PORT || 3000;
initDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
