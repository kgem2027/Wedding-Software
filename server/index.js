import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import registryRoutes from './routes/registry.route.js';
import weddingRoutes from './routes/weddings.route.js';
import usersRoutes from './routes/users.route.js';
const app = express();


//middleware
app.use(express.json());
app.use(express.urlencoded({extended: false})); 




//routes
app.use('/api/auth', authRoutes);
app.use('/api/registry', registryRoutes);
app.use('/api/weddings', weddingRoutes);
app.use('/api/users', usersRoutes);



mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected!");
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
.catch(err => console.log("Connection failed!", err));