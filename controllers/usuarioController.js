var Usuario = require('../models/usuarioModel');
var catchAsync = require('../utils/catchAsync');
var appError = require('../utils/appError');
var jwt = require('jsonwebtoken');
var body = require('body-parser');
var crudFactory = require('../controllers/crudFactoryController');



exports.findOneUsuario = crudFactory.findOneModel(Usuario);
exports.createUsuario = crudFactory.createModel(Usuario);
exports.getAllUsuarios = crudFactory.findAllModel(Usuario);
exports.getOneUsuario = crudFactory.findOneModel(Usuario);
exports.deleteUsuario = crudFactory.deleteModel(Usuario);


exports.getMe = (req, res, next) => {
    // se iguala para poder utilizar crudfactory findOneModel
    req.params.id = req.usuario.id;

    next();
}



exports.updateMe = catchAsync(async(req, res, next) => {
    var id = req.usuario.id
    body = req.body;

    if (body.password || body.passwordConfirmar) {
        var message = 'Aqui no se actualizan password '
        return next(new appError(message, 400))
    }
    var filterObject = (obj, ...permitidos) => {
        var newObj = {};
        Object.keys(obj).forEach(el => { if (permitidos.includes(el)) newObj[el] = obj[el] })
        return newObj;
    }

    var atributosPermitidos = filterObject(body, 'nombre', 'correo');
    var usuario = await Usuario.findByIdAndUpdate(id, atributosPermitidos, { new: true, runValidators: true })



    res.status(200).json({
        ok: true,
        usuario: usuario
    })
})

exports.deleteMe = catchAsync(async(req, res, next) => {
    var id = req.usuario.id;
    await Usuario.findByIdAndUpdate(id, { active: false });

    res.status(203).json({
        ok: true,
        msj: 'cuenta eliminada'
    })

})