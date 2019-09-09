var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
  id: {
    type: String
  },
  token: {
    type: String
  },
  name: {
    type: String
    //required: true
  },
  email: {
    type: String
    //required: true
  },
  password: {
    type: String
    //required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
  //   facebook: {
  //   id: String,
  //   token: String,
  //   email: String,
  //   name: String
  // }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
