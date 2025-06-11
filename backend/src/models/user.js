const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['viewer', 'contributor', 'admin'],
    default: 'viewer',
  },

  subscribed: {
    type: Boolean,
    default: false,
  },

  subscription: {
    plan: { type: String },
    expiresAt: { type: Date },
  },

}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
