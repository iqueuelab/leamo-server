const mongoose = require('mongoose');

const UserRoleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true
  }
});

module.exports = UserRole = mongoose.model('userRole', UserRoleSchema);
