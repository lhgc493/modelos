var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var appErr = require('./utils/appError');
var errorGlobal = require('./controllers/errorController');
var usuarioRoute = require('./routes/usuarioRoutes');
var tourRoute = require('./routes/tourRoute');
var reviewRoute = require('./routes/reviewRoute');
var helmet = require('helmet');
var rateLimit = require('express-rate-limit');
var mongoSanitize = require('express-mongo-sanitize');
var xss = require('xss-clean');
var hpp = require('hpp');

var app = express();
app.use(express.json({ limit: '10kb' }));
app.use(helmet());

var limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'demasiadas peticiones intente dentro de una Hora'
})

app.use(mongoSanitize());
app.use(xss());

app.use(hpp({
    whitelist: [

    ]
}))


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({}));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})


app.use('/api', limiter);
app.use('/api/usuarios', usuarioRoute);
app.use('/api/tours', tourRoute);
app.use('/api/reviews', reviewRoute);
app.all('*', (req, res, next) => {
    var message = `Esta pagina ${req.originalUrl} no existe`;
    next(new appErr(message, 404))
})

app.use(errorGlobal);


module.exports = app;