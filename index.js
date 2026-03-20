import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import flowerRoutes from './routes/flower.route.js';
import registryRoutes from './routes/registry.route.js';
const app = express();


//middleware
app.use(express.json());
app.use(express.urlencoded({extended: false})); 




//routes
app.use('/api/flowers', flowerRoutes);
app.use('/api/users', authRoutes);
app.use('/api/registry', registryRoutes);



mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected!");
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
.catch(err => console.log("Connection failed!", err));