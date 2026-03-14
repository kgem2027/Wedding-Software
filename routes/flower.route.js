import express from 'express';
import pino from 'pino';
const router = express.Router();

import flowersService from '../service/flowers.service.js';
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

// routes

router.get('/', getAll);
router.get('/search/:name', getFlowerByName);
router.get('/:id', getById);
router.post('/', add);
router.put('/:id', update);
router.delete('/:id', remove);

function getAll(req, res) {
    logger.debug('Fetching all flowers');
    flowersService.listFlowers()
        .then(flowers => {
            logger.debug(`Found ${flowers.length} flowers`);
            res.json(flowers);
        })
        .catch(err => res.status(500).json({ error: err.message }));
}

function getById(req, res) {
    const id = req.params.id;
    logger.debug(`Fetching flower with id: ${id}`);
    Flowers.findById(id)
        .then(flower => {
            if (flower) {
                res.json(flower);
            } else {
                res.status(404).json({ error: 'Flower not found' });
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
}

function add(req, res) {
    const { name, quantity, price, image } = req.body;
    logger.debug(`add: ${JSON.stringify(req.body)}`);
    flowersService.addFlower(name, quantity, price, image)
        .then(flower => res.json(flower))
        .catch(err => res.status(500).json({ error: err.message }));
}

function update(req, res) {
  const { id } = req.params;             
  const { name, quantity, price, image } = req.body;

  logger.debug(`Updating flower ${id} with data: ${JSON.stringify(req.body)}`);

  flowersService.updateFlower(id, { name, quantity, price, image })
    .then((flower) =>
      res.json({ response_code: 0, message: "Flower updated successfully", flower })
    )
    .catch((err) =>
      res.status(500).json({ response_code: -1, message: "Flower update failed", error: err.message })
    );
}

function remove(req, res) {
    const id = req.params.id;
    logger.debug(`Deleting flower with id: ${id}`);
    flowersService.deleteFlower(id)
        .then(flower => {
            if (flower) {
                res.json({ response_code: 0, message: 'Flower deleted successfully' });
            } else {
                res.status(404).json({ response_code: -1, message: 'Flower not found' });
            }
        })
        .catch(err => res.status(500).json({ response_code: -1, message: 'Flower delete failed', error: err.message }));
}

function getFlowerByName(req, res) {
    const name = req.params.name;
    logger.debug(`Searching for flower with name: ${name}`);
    flowersService.getFlowerByName(name)
        .then(flower => res.json(flower))
        .catch(err => res.status(500).json({ error: err.message }));
}

    export default router;  