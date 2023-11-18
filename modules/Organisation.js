const mongoose = require('mongoose');

const OrgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subdomain: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  users: {
    type: Number,
    required: true
  },
  gstin: {
    type: String,
    required: true,
    unique: true
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true
  },
  autoRenewal: {
    type: Boolean,
    default: true,
  },
  primaryAdminName: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  orgCourses: {
    type: [String]
  }
});

module.exports = Organisation = mongoose.model('organisation', OrgSchema);
