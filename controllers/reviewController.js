var Review = require('../models/reviewModel');
var crudfactory = require('../controllers/crudFactoryController');


exports.createReview = crudfactory.createModel(Review);
exports.getAllReview = crudfactory.findAllModel(Review, { path: 'user' })
exports.getOneReview = crudfactory.findOneModel(Review);
exports.updateReview = crudfactory.updateModel(Review);
exports.deleteReview = crudfactory.deleteModel(Review);