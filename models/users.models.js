import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const usersSchema = new mongoose.Schema(
    {
    name:{type:String, required:[true, "Please provide a name for the user"]},
    email:{type:String, unique:true, required:[true, "Please provide an email for the user"]},
    role:{type:String, enum:['vendor', 'planner','client','admin','guest'], default:'client'},
    password:{type:String, required:[true, "Please provide a password for the user"]},
    bio:{type:String, default: ''},
    service:{type:String, default:''},},
    {timestamps:true}
);
usersSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
usersSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}
const Users = mongoose.model('User', usersSchema);
export default Users;