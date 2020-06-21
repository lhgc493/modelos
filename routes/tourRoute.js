var express = require('express');
var tourController = require('../controllers/tourController');
var authController = require('../controllers/authController');
var router = express.Router();


router.route('/')
    .post(tourController.createTour)
    .get(tourController.findAllTour)

router.route('/:id')
    .get(tourController.findOneTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour)


router.route('/tours-area/:distance/center/:latlng/unit/:unit')
    .get(tourController.toursEnArea);
module.exports = router;

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistance);