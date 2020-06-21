var Tour = require('../models/tourModel');
var crudFactory = require('../controllers/crudFactoryController');
var appError = require('../utils/appError');
var catchAsyn = require('../utils/catchAsync');
var Tour = require('../models/tourModel');
const router = require('../routes/tourRoute');

exports.createTour = crudFactory.createModel(Tour);
exports.findOneTour = crudFactory.findOneModel(Tour, { path: 'usuarios' });
exports.findAllTour = crudFactory.findAllModel(Tour);
exports.updateTour = crudFactory.updateModel(Tour);
exports.deleteTour = crudFactory.deleteModel(Tour);

//metodo para obtener tours en radios a tu ubicaion
exports.toursEnArea = catchAsyn( async(req, res, next) => {
    // http://localhost:5000/api/tours/tours-area/5000/center/34.595941, -117.643032/unit/mi
    // parametros necesarios e la url
    var {distance, latlng, unit} = req.params;
    // indicar que qie latlng es un array 
    var [lat, lng] = latlng.split(',');

    // se necesita el radio en millas y km 
    // si radio son millas entones dividir / 3963.2
    var radius = unit === 'mi' ? distance/3963.2 : distance/6378.1
    if(!lat || !lng){
        var message = 'latitud y longitus son obligatorias'
        return next(new appError(message, 400))
    }

    console.log(distance, lat, lng,unit)
  // se utiliza el operador $geoWithin y $centerSphere especificando 
  // 1ro lng  2do latitud y el radius
    var tour = await Tour.find({startLocation: {$geoWithin:{$centerSphere:[[lng, lat], radius]}}})

    res.status(200).json({
        ok: true,
        cantidad: tour.length,
        tour: tour
    })
})

// distancia de un punto a otro
exports.getDistance =catchAsyn( async(req, res, next) =>{
    var {latlng, unit} = req.params;
    var [lat, lng] = latlng.split(',');
    //para definir distancia en millas o km
    // 1metro en millas = 0.000621371 
    var multiplicador = unit === 'mi' ? 0.000621371 : 0.001 // por defecto km
    if(!lat || !lng){
        var message = 'Latitud y longitus obligatorio'
        return next(new appError(message,400))
    }
    //aggregation pipe line
     var distance = await Tour.aggregate([
         // solo este operador sirve en agregate y va primero
      {   $geoNear: { // first stage
          near:{
              type: 'Point',
              // 1ro lng 2do lat
              coordinates: [lng*1, lat*1]
          },
          distanceField: 'distance',
          distanceMultiplier: multiplicador // para obtener distancia en millas o km 
      }         
    },
    // second stage para solo visualizar esa info
    {
        $project:{ 
            distance: 1,
            name:1
        }
    }
     ])
    res.status(200).json({
        ok:true,
        data: distance
    })
})

