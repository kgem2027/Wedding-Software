import express from 'express';
import pino from 'pino';
const router = express.Router();
import usersService from '../service/users.service.js';
import Users from '../models/users.models.js';
import { protect, requireRole } from '../middleware/auth.js';
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
router.get('/', protect, requireRole('admin'), list);
router.get('/role/vendor', protect, requireRole('admin', 'planner'), listVendors);
router.get('/role/admin', protect, requireRole('admin', 'planner', 'client'), listAdmins);
router.get('/role/planner', protect, requireRole('admin', 'planner', 'client'), listPlanners);
router.get('/email/:email',protect, requireRole('admin', 'planner'), getByEmail);
router.get('/:id', protect, requireRole('admin'), getById);
router.post('/', protect, requireRole('admin'), add);
router.put('/:id', protect, requireRole('admin', 'client', 'vendor', 'planner'), update);
router.delete('/:id', protect, requireRole('admin', 'planner'), remove);

function list(req, res) {
    usersService.listUsers()
        .then(users => res.json(users))
        .catch(error => res.status(500).json({ error: 'Internal server error: ' + error }));
}
function listVendors(req, res) {
    usersService.getUsersByRole('vendor')
        .then(users => res.json(users))
        .catch(error => res.status(500).json({ error: 'Internal server error: ' + error }));
}
function listAdmins(req, res){
    usersService.getUsersByRole('admin')
        .then(users => res.json(users))
        .catch(error => res.status(500).json({error: 'Internal server error: ' + error}));
}
function listPlanners(req, res) {
    usersService.getUsersByRole('planner')
        .then(users => res.json(users))
        .catch(error => res.status(500).json({ error: 'Internal server error: ' + error }))
}
function getById(req, res) {
    const id = req.params.id;
    usersService.getUserById(id)
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        })
        .catch(error => res.status(500).json({ error: 'Internal server error: ' + error }));

}
function getByEmail(req, res) {
    const email = req.params.email;
    usersService.getUserByEmail(email)
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        })
        .catch(error => res.status(500).json({ error: 'Internal server error: ' + error }));
}
function add(req, res) {
    const { name, email, password, role, bio, service } = req.body;
    usersService.addUser(name, email, password, role, bio, service)
        .then(user => res.status(201).json(user))
        .catch(error => res.status(500).json({ error: 'Internal server error: ' + error}));
}
function update(req, res) {
    const id = req.params.id;
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
        return res.status(403).json({ error: 'Forbidden' })
    }
    const { name, email, password, role, bio, service } = req.body;
    usersService.updateUser(id, name, email, password, role, bio, service)
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        })
        .catch(error => res.status(500).json({ error: 'Internal server error: ' + error }));
}
function remove(req, res) {
    const id = req.params.id;
    usersService.deleteUser(id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        })
        .catch(error => res.status(500).json({ error: 'Internal server error: ' + error }));
}

export default router;