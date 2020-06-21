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
  startLocation: {type: {
    type: String,
    default: 'Point',
    enum: ['Point']
  },
  coordinates: [Number],
  address: String,
  description: String},
  locations: {},
  guides: {},
})

tourSchema.index({startLocation: '2dsphere'})


module.exports = mongoose.model('Tour', tourSchema);