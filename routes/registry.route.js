import express from 'express';
import pino from 'pino';
const router = express.Router();
import registryService from '../service/registry.service.js';
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
// routes
router.get('/', getAll);
router.get('/search/registryItem/:name', getByName);
router.get('/search/registryItemsByStore/:store', getByStore);
router.get('/:id', getById);
router.post('/', add);
router.put('/:id', update);
router.delete('/:id', remove);
function getAll(req, res) {
    logger.debug('Fetching all registry items');
    registryService.listRegistry()
        .then(items => {
            logger.debug(`Found ${items.length} registry items`);
            res.json(items);
        })
        .catch(err => res.status(500).json({ error: err.message }));
}
function getById(req, res) {
    const id = req.params.id;
    logger.debug(`Fetching registry item with id: ${id}`);
    Registry.findById(id)
        .then(item => {
            if (item) {
                res.json(item);
            } else {
                res.status(404).json({ error: 'Registry item not found' });
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
}
function add(req, res) {
    const { itemName, quantity, store, description, link } = req.body;
    logger.debug(`add: ${JSON.stringify(req.body)}`);
    registryService.addRegistryItem(itemName, quantity, store, description, link)
        .then(item => res.json(item))
        .catch(err => res.status(500).json({ error: err.message }));
}
function update(req, res) {  const { id } = req.params;             
  const { itemName, quantity, store, description, link } = req.body;
  logger.debug(`update: ${JSON.stringify(req.body)}`);
    registryService.updateRegistryItem(id, { itemName, quantity, store, description, link })
        .then(item => {
            if (item) {
                res.json(item);
            } else {
                res.status(404).json({ error: 'Registry item not found' });
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
}
function getByName(req, res) {
    const name = req.params.name;
    logger.debug(`Searching registry items with name: ${name}`);
    registryService.getRegistryItemByName(name)
        .then(items => res.json(items))
        .catch(err => res.status(500).json({ error: err.message }));
}
function getByStore(req, res) {
    const store = req.params.store;
    logger.debug(`Searching registry items with store: ${store}`);
    registryService.getRegistryItemsByStore(store)
        .then(items => res.json(items))
        .catch(err => res.status(500).json({ error: err.message }));
}
function remove(req, res) {
    const id = req.params.id;
    logger.debug(`Deleting registry item with id: ${id}`);
    registryService.deleteRegistryItem(id)
        .then(result => {
            if (result) {
                res.json({ message: 'Registry item deleted successfully' });
            } else {
                res.status(404).json({ error: 'Registry item not found' });
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
}
export default router;