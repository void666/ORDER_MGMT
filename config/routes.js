'use strict';

/**
 * Module dependencies.
 */

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' });
const orderController = require('../app/controllers/order.controller');

module.exports = function (app) {

    app.get('/', orderController.init);
    app.get('/order', orderController.search);
    app.get('/order/get', orderController.getOrder);
    app.post('/order/add', orderController.addOrder);
    app.post('/order/bulk/add', upload.single('file'), orderController.addBulkOrder);
    app.delete('/order/delete', orderController.deleteOrder);
    app.get('/order/list_vs_freq', orderController.listOrderAttributeVsFrequency);

    app.use(function (err, req, res, next) {
        // treat as 404
        if (err.message
            && (~err.message.indexOf('not found')
            || (~err.message.indexOf('Cast to ObjectId failed')))) {
            return next();
        }
        console.error(err.stack);
        // error page
        res.status(500).render('500', {error: err.stack});
    });

    // assume 404 since no middleware responded
    app.use(function (req, res, next) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });
};
