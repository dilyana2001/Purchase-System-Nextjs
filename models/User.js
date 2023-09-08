import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    maxlength: 20,
    required: true,
  },
  password: {
    type: String,
    maxlength: 20,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
