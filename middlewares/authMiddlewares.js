// middlewares/authMiddlewares.js

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token not provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

module.exports = {
    async nextMiddleware(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return next();

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return next();
            req.user = user;
            next();
        });
    },

    async userMiddleware(req, res, next) {
        authenticateToken(req, res, async () => {
            if (req.user.role != 'admin' && req.params.id != req.user.id) {
                return res.status(403).json({ error: 'Access denied. Only the requested user or  administrators can access this route.' });
            }
            next();
        });
    },

    async adminMiddleware(req, res, next) {
        authenticateToken(req, res, async () => {
            if (req.user.role != 'admin') {
                return res.status(403).json({ error: 'Access denied. Only administrators can access this route.' });
            }
            next();
        });
    },

    async subscriberMiddleware(req, res, next) {
        authenticateToken(req, res, async () => {
            if (req.user.role != 'subscriber' && req.user.role != 'admin') {
                return res.status(403).json({ error: 'Access denied. Only subscribers or admins can access this route.' });
            }
            next();
        });
    },

    async writerMiddleware(req, res, next) {
        authenticateToken(req, res, async () => {
            if (req.user.role != 'writer' && req.user.role != 'admin') {
                return res.status(403).json({ error: 'Access denied. Only writers or admins can access this route.' });
            }
            next();
        });
    }
};
