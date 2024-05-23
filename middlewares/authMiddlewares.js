// middlewares/adminMiddleware.js

const { error } = require("console");
const { checkRole } = require("../utils/utilMethods");

module.exports =
{
    // (checks whether the logged in user is the same as the requested one.)
    async userMiddleware(req, res, next) {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Unauthenticated user.' });
        }
        if (req.params.id != req.session.userId && (await checkRole(req.session.userId)) != 'admin') {
            return res.status(401).json({ error: 'Access denied. Only administrators or the requested user can access this route.' })
        }
        next();
    },

    // (checks if the administrator is logged in)
    async adminMiddleware(req, res, next) {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Unauthenticated user.' });
        }
        if ((await checkRole(req.session.userId)) != 'admin') {
            return res.status(403).json({ error: 'Access denied. Only administrators can access this route.' });
        }
        next();
    },

    // (checks if the subscriber is logged in)
    async subscriberMiddleware(req, res, next) {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Unauthenticated user.' });
        }
        if ((await checkRole(req.session.userId)) != 'subscriber' && (await checkRole(req.session.userId)) != 'admin') {
            return res.status(403).json({ error: 'Access denied. Only subscribers can access this route.' });
        }
        next();
    },

    // (checks if the writer is logged in)
    async writerMiddleware(req, res, next) {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Unauthenticated user.' });
        }
        if ((await checkRole(req.session.userId)) != 'writer' && (await checkRole(req.session.userId)) != 'admin') {
            return res.status(403).json({ error: 'Access denied. Only writers can access this route.' });
        }
        next();
    }
}