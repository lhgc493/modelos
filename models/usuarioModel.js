var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('validator');
var usuarioSchema = new Schema({

  name: {},
  email: {},
  photo: {},
  role: {},
  password: {},
  passwordConfirm: {},
  passwordChangeAt: {},
  passwordResetToken: {},
  passwordResetExpires: {},
  active: {}


})

module.exports = mongoose.model('Usuario', usuarioSchema);