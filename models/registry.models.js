import mongoose from "mongoose";

const registrySchema = new mongoose.Schema(
{
  itemName:{type:String, required:[true, "Please provide a name for the registry"]},
  quantity:{type:Number, required:[true, "Please provide a quantity for the registry"]},
  store:{type:String, required:[true, "Please provide a store for the registry"]},
  description:{type:String},
  link:{type:String},

  weddingId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Wedding',
    required:true
  },

  addedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  }

},
{timestamps:true}
);

const Registry = mongoose.model('Registry', registrySchema);
export default Registry;