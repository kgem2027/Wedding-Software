import pino from 'pino';
import Weddings from '../models/weddings.models.js';
const logger = pino({
    level: 'debug',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});
async function getAllWeddings(userId, role) {
    logger.info('Listing all weddings from database');
    if (role === 'admin') {
        return await Weddings.find({});
    }
    if (role === 'planner') {
        return await Weddings.find({ plannerId: userId });
    }
    return await Weddings.find({ 'accessList.userId': userId });
}
async function createWedding(weddingName, weddingDate, plannerId, accessList) {
    const wedding = new Weddings({ weddingName, weddingDate, plannerId , accessList });
    return await wedding.save();
}
async function getWeddingById(id) {
    return await Weddings.findById(id);
}
async function updateWedding(id, data) {
    return await Weddings.findByIdAndUpdate(id, data, { new: true });
}
async function deleteWedding(id) {
    return await Weddings.findByIdAndDelete(id);
}
async function getWeddingsByUserId(userId) {
    return await Weddings.find({ 'accessList.userId': userId });
}
export default {
    createWedding,
    getWeddingById,
    updateWedding,
    deleteWedding,
    getWeddingsByUserId,
    getAllWeddings
};