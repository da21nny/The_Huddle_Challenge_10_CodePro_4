import rateLimit from 'express-rate-limit';

const loginRateLimiter = rateLimit({
    windowMs: 15 * 1000, // 15 segundos (temporal para pruebas)
    max: 5, // Bloquear después de 5 intentos fallidos desde una misma IP
    message: 'Demasiados intentos de inicio de sesión. Inténtalo de nuevo en 15 segundos.'
});

const generalLimiter = rateLimit({
    windowMs: 15 * 1000, // 15 segundos (temporal para pruebas)
    max: 100, // Límite general para evitar DoS simple
    message: 'Has excedido el límite de peticiones. Inténtalo de nuevo en 15 segundos.'
});

export { loginRateLimiter, generalLimiter };
