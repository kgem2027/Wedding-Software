import express from 'express';
import pino from 'pino';
import { protect, requireRole } from '../middleware/auth.js';
import weddingService from '../service/wedding.service.js';
import checkWeddingAccess from '../middleware/checkWeddingAccess.js';
import Users from '../models/users.models.js';
const router = express.Router();
const logger = pino({
    level: 'debug',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});
router.get('/',protect, requireRole('admin','planner','client','vendor'), getAll);
router.get('/auth/:authPassword', getByAuthCode);
router.post('/create', protect, requireRole('admin','planner'), create);
router.get('/:id',protect, requireRole('admin','planner','client','vendor'), checkWeddingAccess, getById);
router.put('/:id', protect, requireRole('admin','planner'), update);
router.delete('/:id', protect, requireRole('admin'), remove);
router.post('/:id/access', protect, requireRole('admin','planner'), addVendorAccess);
router.delete('/:id/access/:userId', protect, requireRole('admin','planner'), removeVendorAccess);


function getAll(req, res) {
    const{_id:userId, role} = req.user;
    logger.debug('Fetching all weddings');
    weddingService.getAllWeddings(userId, role)
        .then(weddings => {
            logger.debug(`Found ${weddings.length} weddings`);
            res.json(weddings);
        })
        .catch(error => {
            logger.error('Error fetching weddings:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
}
function getByAuthCode(req, res) {
    const { authPassword } = req.params;
    logger.debug(`Fetching wedding with authPassword: ${authPassword}`);
    weddingService.getWeddingByAuthCode(authPassword)
        .then(wedding => {
            if (!wedding) {
                logger.warn(`Wedding with authCode ${authPassword} not found`);
                res.status(404).json({ error: 'Wedding not found' });
                return;
            }
            logger.debug(`Found wedding: ${JSON.stringify(wedding)}`);
            res.json(wedding);
        })
        .catch(error => {
            logger.error('Error fetching wedding:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
}

function create(req, res) {
    const { weddingName, weddingDate, plannerId, accessList, privacy } = req.body;
     logger.debug(`Creating wedding with data: ${JSON.stringify(req.body)}`);
    weddingService.createWedding(weddingName, weddingDate, plannerId, accessList, privacy)
        .then(async (wedding) => {
            const populatedWedding = await wedding.populate({
                path: "plannerId",
                select: "name -_id"
            })
            logger.debug(`Wedding created: ${JSON.stringify(wedding)}`);
            res.status(201).json(populatedWedding);
        })
        .catch(error => {
            res.status(500).json({ error: 'Internal server error' });
        })
}
function getById(req, res) {
    const id = req.params.id;
    logger.debug(`Fetching wedding with id: ${id}`);
    weddingService.getWeddingById(id)
        .then(wedding => {
            if (!wedding) {
                logger.warn(`Wedding with id ${id} not found`);
                res.status(404).json({ error: 'Wedding not found' });
                return;
            }
            logger.debug(`Found wedding: ${JSON.stringify(wedding)}`);
            res.json(wedding);
        })
        .catch(error => {
            logger.error('Error fetching wedding:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
}
function update(req, res) {
    const { id } = req.params;
    const { weddingName, weddingDate, accessList, privacy } = req.body;
    logger.debug(`Updating wedding with id: ${id}`);
    weddingService.updateWedding(id, { weddingName, weddingDate, accessList, privacy })
        .then(wedding => {
            if (!wedding) {
                logger.warn(`Wedding with id ${id} not found`);
                res.status(404).json({ error: 'Wedding not found' });
                return;
            }
            logger.debug(`Wedding updated: ${JSON.stringify(wedding)}`);
            res.json(wedding);
        })
        .catch(error => {
            logger.error('Error updating wedding:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
}
function remove(req, res) {
    const id = req.params.id;
    logger.debug(`Deleting wedding with id: ${id}`);
    weddingService.deleteWedding(id)
        .then(wedding => {
            if (!wedding) {
                logger.warn(`Wedding with id ${id} not found`);
                res.status(404).json({ error: 'Wedding not found' });
                return;
            }
            logger.debug(`Wedding deleted: ${JSON.stringify(wedding)}`);
            res.json({ message: 'Wedding deleted successfully' });
        })
        .catch(error => {
            logger.error('Error deleting wedding:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
}

async function addVendorAccess(req, res) {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const vendor = await Users.findById(userId);
    if (!vendor) return res.status(404).json({ error: 'No user found' });
    if (vendor.role !== 'vendor') return res.status(400).json({ error: 'User is not a vendor' });
    const wedding = await weddingService.addVendorToAccessList(id, vendor._id, req.user._id);
    if (!wedding) return res.status(404).json({ error: 'Wedding not found' });
    res.json(wedding);
}
async function removeVendorAccess(req, res) {
    const { id, userId } = req.params;
    const wedding = await weddingService.removeFromAccessList(id, userId);
    if (!wedding) return res.status(404).json({ error: 'Wedding not found' });
    res.json(wedding);
}

export default router;