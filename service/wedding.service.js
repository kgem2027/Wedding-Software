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
    const populate = { path: 'accessList.userId', select: 'name email role service' };
    if (role === 'admin') {
        return await Weddings.find({}).populate('plannerId', 'name').populate(populate);
    }
    if (role === 'planner') {
        return await Weddings.find({ plannerId: userId }).populate('plannerId', 'name').populate(populate);
    }
    if (role === 'vendor') {
        return await Weddings.find({ 'accessList.userId': userId }).populate('plannerId', 'name').populate(populate);
    }
    // clients
    return await Weddings.find({
        $or: [
            { 'accessList.userId': userId },
            { privacy: 'public' }
        ]
    }).populate('plannerId', 'name').populate(populate);
}
async function createWedding(weddingName, weddingDate, plannerId, accessList, privacy) {
    const wedding = new Weddings({ weddingName, weddingDate, plannerId , accessList, privacy });
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
async function getWeddingByAuthCode(authPassword) {
    return await Weddings.findOne({ authPassword });
}
async function addVendorToAccessList(weddingId, userId, grantedBy) {
    return await Weddings.findByIdAndUpdate(
        weddingId,
        { $addToSet: { accessList: { userId, role: 'vendor', grantedBy } } },
        { new: true }
    ).populate({ path: 'accessList.userId', select: 'name email role service' });
}
async function removeFromAccessList(weddingId, userId) {
    return await Weddings.findByIdAndUpdate(
        weddingId,
        { $pull: { accessList: { userId } } },
        { new: true }
    ).populate({ path: 'accessList.userId', select: 'name email role service' });
}
export default {
    createWedding,
    getWeddingById,
    updateWedding,
    deleteWedding,
    getWeddingsByUserId,
    getAllWeddings,
    getWeddingByAuthCode,
    addVendorToAccessList,
    removeFromAccessList
};