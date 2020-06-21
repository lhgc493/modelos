var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var reviewSchema = new Schema({    
    review: {},
    rating: {},
    createAt: {},
    tour: {},
    user: {}

})

module.exports = mongoose.model('Review', reviewSchema);