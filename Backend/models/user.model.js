import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true
  },
  department: {
    type: String
  },
  designation: {
    type: String
  },
  role: {
    type: String,
    enum: ['employee', 'admin'],
    default: 'employee'
  }
}, {
  timestamps: true 
});


const User = mongoose.model('admin', userSchema);

export default User;