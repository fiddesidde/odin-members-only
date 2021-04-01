const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hash: {
    type: String,
    required: true,
  },
  firstname: String,
  lastname: String,
  tier: {
    type: String,
    enum: ['base', 'member', 'admin'],
    required: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
