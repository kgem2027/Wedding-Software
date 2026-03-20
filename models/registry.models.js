import mongoose from "mongoose";
const registrySchema = new mongoose.Schema(
    {
    itemName:{type:String, required:[true, "Please provide a name for the registry"]},
    quantity:{type:Number, required:[true, "Please provide a quantity for the registry"]},
    store:{type:String, required:[true, "Please provide a store for the registry"]},
    description:{type:String, required:[false, "Please provide a description for the registry"]},
    link:{type:String, required:[false, "Please provide a link for the registry"]}
    }
);
const Registry = mongoose.model('Registry', registrySchema);
export default Registry;