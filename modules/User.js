const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  department: { type: String },
  manager: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: { type: String, required: true },
  address: { type: String },
  state: { type: String },
  country: { type: String },
  avatar: { type: String },
  birthDate: { type: Date },
  joiningDate: { type: Date, default: Date.now },
  orgId: { type: String },
  accessibleCourses: { type: [String] }
});

module.exports = User = mongoose.model('user', UserSchema);
