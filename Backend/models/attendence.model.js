import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',  
    // required: true
  },
  empId: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  location: {
    type: String
  },
  photo: {
    type: String 
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true 
});

const Attendance = mongoose.model('attendance', attendanceSchema);

export default Attendance;
