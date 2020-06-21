var express = require('express');
var reviewController = require('../controllers/reviewController');
var router = express.Router();

router.route('/')
.get(reviewController.getAllReview)
.post(reviewController.createReview);

router.route('/:id')
.get(reviewController.getOneReview)
.patch(reviewController.updateReview)
.delete(reviewController.deleteReview);


module.exports = router;