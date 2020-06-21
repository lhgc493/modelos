var mongoose = require('mongoose');
var dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
console.log(process.env.NODE_ENV);

//  errores dentro de la app syncronas
/* process.on('uncaughtException', err => {
    console.log('UNCAUGHTEXCEPTION shutting down');
    console.log(err.name, err.message);
    process.exit(1); 

})*/
var app = require('./app');

// conexion bd

var db = process.env.DATABASE_LOCAL
mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('conexion modeloDB desde server exitosa'));

var port = process.env.PORT;
var server = app.listen(port, () => {
    console.log(`server ${port} up`)
})

/// errores exteriores a al app coneccion bd asyncronas
/* process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION shutting down');
    server.close(() => {
        process.exit(1)
    })
}) */