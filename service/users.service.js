import pino from 'pino';
import Users from '../models/users.models.js';
const logger = pino({
    level: 'debug',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});
async function listUsers() {
    logger.info('Listing all users from database');
    return await Users.find({});
}
async function getUserById(id) {
    return await Users.findById(id);
}
async function addUser(name, email, password, role) {
    const user = new Users({ name, email, password, role });
    return await user.save();
}
async function updateUser(id, name, email, password, role, service) {
  const data = { name, email, role };
  if (password) data.password = password;
  if (service !== undefined) data.service = service;
  return await Users.findByIdAndUpdate(id, data, { new: true });
}
async function deleteUser(id) {
    return await Users.findByIdAndDelete(id);
}  
async function getUserByEmail(searchEmail) {
    return await Users.findOne({ email: searchEmail });
}
async function getUsersByRole(role) {
    return await Users.find({ role });
}

export default {
    listUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    getUserByEmail,
    getUsersByRole
};