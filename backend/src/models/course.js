const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  category: String,
  link: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: false, // Or true if price is mandatory
    default: 0
  },
  imageUrl: {
    type: String,
    required: false, // Or true if image is mandatory
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Course', courseSchema);
