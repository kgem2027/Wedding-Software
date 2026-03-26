import pino from 'pino';
import Weddings from '../models/weddings.models.js';

const logger = pino({ level: 'debug' });

const checkWeddingAccess = async (req, res, next) => {
    const { role, _id: userId } = req.user;   // req.user comes from your protect()
    const { id: weddingId } = req.params;

    // Admins see everything
    if (role === 'admin') return next();

    const wedding = await Weddings.findById(weddingId);
    if (!wedding) return res.status(404).json({ message: 'Wedding not found' });

    // Planners must be the assigned planner
    if (role === 'planner') {
        if (wedding.plannerId.toString() !== userId.toString()) {
            logger.debug(`Planner ${userId} not assigned to wedding ${weddingId}`);
            return res.status(403).json({ message: 'Access denied' });
        }
        return next();
    }

    // Clients and vendors must be in the accessList
    const hasAccess = wedding.accessList.some(
        entry => entry.userId.toString() === userId.toString()
    );

    if (!hasAccess) {
        logger.debug(`User ${userId} not in accessList for wedding ${weddingId}`);
        return res.status(403).json({ message: 'You do not have access to this wedding' });
    }

    next();
};

export default checkWeddingAccess;