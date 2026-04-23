import pino from 'pino';
import bcrypt from 'bcrypt';
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
async function addUser(name, email, password, role, bio, service) {
    const user = new Users({ name, email, password, role, ...(service && { service }), ...(bio && {bio}) });
    return await user.save();
}
async function updateUser(id, name, email, password, role, bio, service) {
  const data = { name, email, role };
  if (password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(password, salt);
  }
  if (service !== undefined) data.service = service;
  if (bio !== undefined) data.bio = bio;
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