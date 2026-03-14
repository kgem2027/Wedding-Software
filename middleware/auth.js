import pino from 'pino';
import Users from '../models/users.models.js';
import jwt from 'jsonwebtoken';
const logger = pino({
    level: 'debug',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});

export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await Users.findById(decoded.id).select('-password');
            logger.debug('User authenticated:', req.user);
            return next();
        } catch (error) {
            logger.error('Token verification failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        logger.debug('No token provided');
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};