import mongoose from 'mongoose';

const TimerSchema = new mongoose.Schema({
  startDateTime: {
    type: Date,
    required: true,
  },
  endDateTime: {
    type: Date,
    required: true,
  },
  shop: {
    type: String, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Timer = mongoose.model('Timer', TimerSchema);

export default Timer;
