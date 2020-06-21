var catchAsyn = require('../utils/catchAsync');
var appError = require('../utils/appError');
var body = require('body-parser');
var filtros = require('../utils/filtros');
var jwt = require('jsonwebtoken');


exports.createModel = Model =>
    catchAsyn(async(req, res, next) => {
        body = req.body;
        var model = await Model.create(body);
        var token = jwt.sign({ id: model.id }, process.env.JWT_SEED, { expiresIn: process.env.JWT_EXP })
        res.status(200).json({
            ok: true,
            data: { model },
            token: token
        })

    })

exports.findOneModel = (Model, popOpciones) =>
    catchAsyn(async(req, res, next) => {
        var id = req.params.id
        var query = Model.findById(id);
        if (popOpciones) query = query.populate(popOpciones);

        var model = await query;
        if (!model) {
            var message = 'El documento no existe';
            return next(new appError(message, 404))
        }
        res.status(200).json({
            ok: true,
            data: { model }
        })
    })

exports.findAllModel = Model =>
    catchAsyn(async(req, res, next) => {

        var anidado = {};
        if (req.params.tourId) anidado = { tour: req.params.tourId }

        var feature = new filtros(Model.find(anidado), req.query).filter().sort().fields().paginacion();

        var model = await feature.query;
        res.status(200).json({
            ok: true,
            data: { model }
        })
    })

exports.updateModel = Model =>
    catchAsyn(async(req, res, next) => {
        var id = req.params.id;
        body = req.body;
        var model = await Model.findByIdAndUpdate(id, body, { new: true, runValidators: true })
        if (!model) {
            var message = 'El documento no existe';
            return next(new appError(message, 404))
        }
        res.status(200).json({
            ok: true,
            data: { model }
        })

    })
exports.deleteModel = Model =>
    catchAsyn(async(req, res, next) => {
        var id = req.params.id;
        var model = await Model.findByIdAndDelete(id);
        if (!model) {
            var message = 'El documento no existe';
            return next(new appError(message, 404))
        }
        res.status(203).json({
            ok: true,
            data: null
        })
    })