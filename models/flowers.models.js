import mongoose from 'mongoose';
const flowersSchema = new mongoose.Schema(
    { 
    name:{type:String, required:[true, "Please provide a name for the flower"]},
    quantity:{type:Number, required:[true, "Please provide a quantity for the flower"]},
    price:{type:Number, required:[true, "Please provide a price for the flower"]},
    image:{type:String, required:[false, "Please provide an image for the flower"]},
    },
    {timestamps:true}
);
const Flowers = mongoose.model('Flower', flowersSchema);
export default Flowers;