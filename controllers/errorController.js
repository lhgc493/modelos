var appError = require('../utils/appError');
//////////ERRORES DE desarrollo
var errorDesarrollo = (err, res) => {
    return res.status(err.statusCode).json({
        ok: err.status,
        message: err.message,
        errors: err,
        stack: err.stack
    })

};

//////////ERRORES DE PRODUCCION

/////CAST ERROR (MONGO NO PUEDE CONVERTIR ID )

var castErrorMongo = err => {
    var message = `El ${err.path} : ${err.value} no es valido!`
    return new appError(message, 400);
}

var camposUniqueMongo = err => {
    var value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];

    var message = `${value} ya esta siendo utilizado por alguien mas!`
    return new appError(message, 400);
}

var validacionesMongo = err => {
    var errors = Object.values(err.errors).map(el => el.message);
    var message = `Informacion invalida. ${errors.join('. ')}`;
    return new appError(message, 400)
}

///////// errores JWT

var tokenInvalido = () => new appError('Token invalido, por favor ingrese nuevamente', 401);
var tokenExpirado = () => new appError('Token expirado, vuelva a ingresar por favor', 401);

var errorProduction = (err, res) => {
    //si son errores operacionales 
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            ok: err.status,
            message: err.message
        })
    }
    // si no son operacionales mensaje generico para no dar detalles en producions
    else {
        console.log('ERROR NO OPERACIONAL', err)
        return res.status(500).json({
            ok: false,
            message: 'Disculpe las molestias algo salio mal'
        })
    }

}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';


    if (process.env.NODE_ENV === 'development') {
        errorDesarrollo(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        var error = {...err };
        error.message = err.message
        if (error.name === 'CastError') error = castErrorMongo(error);
        if (error.code === 11000) error = camposUniqueMongo(error);
        if (error.name === 'ValidationError') error = validacionesMongo(error);

        if (error.name === 'JsonWebTokenError') error = tokenInvalido();
        if (error.name === 'TokenExpiredError') error = tokenExpirado();
        errorProduction(error, res)

    }

}