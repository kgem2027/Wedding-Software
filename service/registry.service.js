import pino from 'pino';
import Registry from '../models/registry.models.js';
const logger = pino({
    level: 'debug',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});

async function listRegistry() {
    logger.info('Listing all registry items from database');
    return await Registry.find({});
}
async function getRegistryItemById(id) {
    logger.info(`Fetching registry item with ID: ${id}`);
    return await Registry.findById(id);
}
async function addRegistryItem(itemName, quantity, store, description, link, weddingId) {
    logger.info(`Adding new registry item: ${itemName}`);
    const registryItem = new Registry({ itemName, quantity, store, description, link, weddingId });
    return await registryItem.save();
}
async function updateRegistryItem(id, data) {
    logger.info(`Updating registry item with ID: ${id}`);
    return await Registry.findByIdAndUpdate(id, data, { new: true });
}
async function deleteRegistryItem(id) {
    logger.info(`Deleting registry item with ID: ${id}`);
    return await Registry.findByIdAndDelete(id);
}
async function getRegistryItemByName(searchName) {
    logger.info(`Searching registry items with name: ${searchName}`);
    return await Registry.find({ itemName: { $regex: searchName, $options: 'i' } });
}
async function getRegistryItemsByStore(searchStore) {
    logger.info(`Searching registry items with store: ${searchStore}`);
    return await Registry.find({ store: { $regex: searchStore, $options: 'i' } });
}
async function getRegistryItemsByWeddingId(weddingId) {
    logger.info(`Fetching registry items for wedding ID: ${weddingId}`);
    return await Registry.find({ weddingId });
}
async function markAsBought(id, buyerName) {
    logger.info(`Marking registry item ${id} as bought by ${buyerName}`);
    return await Registry.findByIdAndUpdate(
        id,
        { bought: true, boughtBy: buyerName },
        { new: true }
    );
}
export default {
    getRegistryItemsByWeddingId,
    listRegistry,
    getRegistryItemById,
    addRegistryItem,
    updateRegistryItem,
    deleteRegistryItem,
    getRegistryItemByName,
    getRegistryItemsByStore,
    markAsBought
};