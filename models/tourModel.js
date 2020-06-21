var mongoose = require('mongoose');
var validator = require('validator');

var Schema = mongoose.Schema;
var tourSchema = new Schema({
  name: {},
  slug: String,
  duration: {},
  maxGroupSize: {},
  difficulty: {},
  ratingsAverage: {},
  ratingsQuantity: {},
  price: {},
  priceDiscount: {},
  summary: {},
  description: {},
  imageCover: {},
  images: {},
  startDates: {},
  startLocation: {},
  locations: {},
  guides: {},
})


module.exports = mongoose.model('Tour', tourSchema);