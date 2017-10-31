const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  googleID: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  fistname: {
    type: String
  },
  lastname: {
    type: String
  },
  image: {
    type: String
  }
});

mongoose.model('users', UserSchema);
