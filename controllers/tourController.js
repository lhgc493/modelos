var Tour = require('../models/tourModel');
var crudFactory = require('../controllers/crudFactoryController');

exports.createTour = crudFactory.createModel(Tour);
exports.findOneTour = crudFactory.findOneModel(Tour, { path: 'usuarios' });
exports.findAllTour = crudFactory.findAllModel(Tour);
exports.updateTour = crudFactory.updateModel(Tour);
exports.deleteTour = crudFactory.deleteModel(Tour);