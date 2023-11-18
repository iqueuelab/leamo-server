const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  author: { type: String, required: true },
  duration: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: null },
  enrolledUsers: { type: Number, default: 0 },
  ratings: { type: String, default: '0' },
  city: { type: String, required: true },
  orgId: { type: String },
});

module.exports = Course = mongoose.model('course', CourseSchema);
