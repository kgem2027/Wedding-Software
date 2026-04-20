import mongoose from "mongoose";
const generateRandomString = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
const generateAuthPassword = () => generateRandomString(16);
const accessEntrySchema = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    role:{type:String, enum:['vendor', 'client'], required:true},
    grantedBy:{type: mongoose.Schema.Types.ObjectId, ref:'User', required:true}
    }, {_id: false}
);
const guestSchema = new mongoose.Schema({
    firstName: {type:String, required:true},
    lastName: {type: String, required:true}
})

const weddingsSchema = new mongoose.Schema({
    weddingName:{type:String, required:[true, "Please provide a name for the wedding"]},
    weddingDate:{type:String, required:[true, "Please provide a date for the wedding"]},
    plannerId:{type: mongoose.Schema.Types.ObjectId, ref:'User', required:false},
    accessList:[accessEntrySchema],
    privacy: {type: String, enum: ["private", "public"], default: 'private'},
    createdAt: {type: Date, default: Date.now},
    authPassword: {type: String, required: true, default: generateAuthPassword, unique: true},
    guestList: [guestSchema]
});




const Weddings = mongoose.model('Wedding', weddingsSchema);
export default Weddings;