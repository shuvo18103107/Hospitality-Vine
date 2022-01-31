const catchAsync = require('../utilis/catchAsync');
const AppError = require('../utilis/appError');
const APIFeatures = require('../utilis/apiFeatures');
const  _ = require('lodash');

exports.deleteOne = Model => {
    return catchAsync(async (req, res, next) => {

        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return next(new AppError('No document found with that ID', 404));

        }

        res.status(204).json({
            status: 'success',
            data: null,
        });

    });
}

exports.updateOne = Model => {
    return catchAsync(async (req, res, next) => {

        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true, //here new updated document is returned by giving true we can also specify the field which we want to update
            runValidators: true, //each time we updated the document the validator we define in scema will run again
        });
        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });

    });
}

exports.createOne = Model => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                data: doc,
            },
        })
    })
}

exports.getOne = (Model, popOptions) => {
    return catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOptions) query = Model.findById(req.params.id).populate(popOptions);
        const doc = await query;
        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                doc,
            },
        });

    });
}
exports.getAll = Model => {
    return catchAsync(async (req, res, next) => {

        let filter = {};
        if (req.params.roomId) filter = { room: req.params.roomId }

        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort() 
            .limitFields()
            .pagination();

        const doc = await features.query;

        res.status(200).json({
            status: 'success',

            results: doc.length,
            data: {
                data: doc,
            },
        });



    });
}
