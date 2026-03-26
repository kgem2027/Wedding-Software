import mongoose from "mongoose";
const accessEntrySchema = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    role:{type:String, enum:['vendor', 'client'], required:true},
    grantedBy:{type: mongoose.Schema.Types.ObjectId, ref:'User', required:true}
    }, {_id: false}
);
const weddingsSchema = new mongoose.Schema({
    weddingName:{type:String, required:[true, "Please provide a name for the wedding"]},
    weddingDate:{type:String, required:[true, "Please provide a date for the wedding"]},
    plannerId:{type: mongoose.Schema.Types.ObjectId, ref:'User', required:false},
    accessList:[accessEntrySchema],
    createdAt: {type: Date, default: Date.now}
});
const Weddings = mongoose.model('Wedding', weddingsSchema);
export default Weddings;