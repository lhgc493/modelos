var Usuario = require('../models/usuarioModel');
var catchAsyn = require('../utils/catchAsync');
var appError = require('../utils/appError');
var body = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var mandarCorreo = require('../utils/correo');


exports.signup = catchAsyn(async(req, res) => {

    body = req.body;

    var usuario = await Usuario.create({
        nombre: body.nombre,
        correo: body.correo,
        password: body.password,
        passwordConfirmar: body.passwordConfirmar
    })

    var token = jwt.sign({ id: usuario.id }, process.env.JWT_SEED, { expiresIn: process.env.JWT_EXP });

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXP * 24 * 60 * 60 * 1000),
        httpOnly: true,
        ...(process.env.NODE_ENV === 'production' && { secure: true })
    })

    res.status(200).json({
        ok: true,
        usuario: usuario,
        token: token
    })

})

exports.signin = catchAsyn(async(req, res, next) => {

    var body = req.body;

    if (!body.correo || !body.password) {
        var message = 'Llene los campos solicitados'
        return next(new appError(message, 400))
    }

    var usuario = await Usuario.findOne({ correo: body.correo }).select('+password');

    if (!usuario || !(await bcrypt.compare(body.password, usuario.password))) {
        var message = 'usuario o password incorrectos'
        return next(new appError(message, 400))
    }

    var token = jwt.sign({ id: usuario.id }, process.env.JWT_SEED, { expiresIn: process.env.JWT_EXP });



    res.status(200).json({
        ok: true,

        token: token
    })
});

exports.autenticar = catchAsyn(async(req, res, next) => {
    var token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        var message = 'Token incorrecto o no existe'
        return next(new appError(message, 400))
    }

    var decoded = jwt.verify(token, process.env.JWT_SEED);

    console.log(decoded)

    var usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
        var message = 'Usted ya no forma parte de esta organizacion'
        return next(new appError(message, 400))
    }

    if (usuario.verificarCambioPassword(decoded.iat)) {
        var message = 'Cambiaste de password'
        return next(new appError(message, 400))
    }

    req.usuario = usuario;

    next();
});

exports.autorizar = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.usuario.role)) {
            var message = 'No estas autorizado'
            return next(new appError(message, 400))
        }

        next();
    }
}

exports.passwordOlvidado = catchAsyn(async(req, res, next) => {
    //1 buscar email 
    body = req.body;
    var usuario = await Usuario.findOne({ correo: body.correo });
    if (!usuario) {
        var message = 'No existe ese correo'
        return next(new appError(message, 400))
    }
    //2 generar token y guadarlo

    var tokenRandom = usuario.resetToken();
    await usuario.save({ validateBeforeSave: false });

    //3 mandar correo

    var urlReset = `${req.protocol}://${req.get('host')}/api/usuarios/resetToken/${tokenRandom}`;
    var message = `Aqui puede cambiar su contraseña ${urlReset}`;

    try {
        await mandarCorreo({
            email: usuario.correo,
            subject: 'Expira en 10 minutos',
            message
        })

        res.status(200).json({
            ok: true,
            msj: 'se mando correo'
        })

    } catch (error) {
        usuario.passwordResetToken = undefined;
        usuario.passwordResetTokenExp = undefined;
        await usuario.save({ validateBeforeSave: false });
        var message = 'Vuelva a intentar '
        return next(new appError(message, 400))

    }
})

exports.resetPassword = catchAsyn(async(req, res, next) => {

    //1 encriptar to0ekn para compararlo

    body = req.body;

    var tokenRadom = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // 2 buscar
    var usuario = await Usuario.findOne({ passwordResetToken: tokenRadom, passwordResetTokenExp: { $gt: Date.now() } });
    if (!usuario) {
        var message = 'Token incorrecto o expirado vuelva a solicitar su token '
        return next(new appError(message, 400))
    }

    usuario.password = body.password;
    usuario.passwordConfirmar = body.passwordConfirmar;
    usuario.passwordResetToken = undefined;
    usuario.passwordResetTokenExp = undefined;

    await usuario.save();

    // crear toeken
    var token = jwt.sign({ id: usuario.id }, process.env.JWT_SEED, { expiresIn: process.env.JWT_EXP });


    res.status(200).json({
        ok: true,
        token: token
    })

})

exports.updatePassword = catchAsyn(async(req, res, next) => {

    var id = req.usuario.id;
    body = req.body;
    var usuario = await Usuario.findById(id).select('+password');

    if (!(await bcrypt.compare(body.passwordActual, usuario.password))) {
        var message = 'Password incorrecto '
        return next(new appError(message, 400))
    }

    usuario.password = body.password;
    usuario.passwordConfirmar = body.passwordConfirmar;
    usuario.passwordChangeAt = Date.now();

    await usuario.save();
    var token = jwt.sign({ id: usuario.id }, process.env.JWT_SEED, { expiresIn: process.env.JWT_EXP });

    res.status(200).json({
        ok: true,
        token: token
    })
})