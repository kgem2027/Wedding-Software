import pino from 'pino';    
import Flowers from '../models/flowers.models.js';
const logger = pino({
    level: 'debug',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});

async function listFlowers() {
    logger.info('Listing all flowers from database');
    return await Flowers.find({});
}

async function getFlowerById(id) {
    return await Flowers.findById(id);
}

async function addFlower(name, quantity, price, image) {
    const flower = new Flowers({ name, quantity, price, image });
    return await flower.save();
}

async function updateFlower(id, data) {
  return await Flowers.findByIdAndUpdate(id, data, { new: true });
}

async function deleteFlower(id) {
    return await Flowers.findByIdAndDelete(id);
}

async function getFlowerByName(searchName) {
    return await Flowers.find({ name: { $regex: searchName, $options: 'i' } });
}

export default {
    listFlowers,
    getFlowerById,
    addFlower,
    updateFlower,
    deleteFlower,
    getFlowerByName
};