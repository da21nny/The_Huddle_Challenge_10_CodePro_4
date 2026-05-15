const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Email y contraseña son requeridos');
        }

        await User.create({ email, password });
        res.redirect('/login?registered=true');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const login = async (req, res) => {
    try {
        const { email, password, sessionType } = req.body;
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).send('Credenciales inválidas');
        }

        // Control de fuerza bruta manual en memoria
        if (user.lockedUntil && user.lockedUntil > Date.now()) {
            return res.status(403).send('Cuenta bloqueada temporalmente. Intenta más tarde.');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            user.failedAttempts += 1;
            if (user.failedAttempts >= 5) {
                await User.update(user.id, { 
                    failedAttempts: user.failedAttempts, 
                    lockedUntil: Date.now() + 15 * 60 * 1000 
                });
            } else {
                await User.update(user.id, { failedAttempts: user.failedAttempts });
            }
            return res.status(401).send('Credenciales inválidas');
        }

        // Reset de intentos fallidos
        await User.update(user.id, { failedAttempts: 0, lockedUntil: null });

        if (sessionType === 'jwt') {
            // Generar JWT
            const token = generateToken(user);
            // En una API real devolveríamos el token JSON. Como esto es MVC con plantillas, lo setearemos como una cookie o lo pasaremos a la vista.
            // Para mantener la simplicidad y cumplir la opción de JWT en web, lo setearemos en una cookie.
            res.cookie('jwt_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            return res.redirect('/dashboard');
        } else {
            // Sesión Persistente con Cookie
            req.session.userId = user.id;
            return res.redirect('/dashboard');
        }

    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
};

const logout = (req, res) => {
    req.session.destroy();
    res.clearCookie('jwt_token');
    res.clearCookie('connect.sid');
    res.redirect('/login');
};

module.exports = { register, login, logout };
