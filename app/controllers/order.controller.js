var orderService = require('./../services/order.server.service');
var fs = require('fs');
var csv = require('fast-csv');
var _ = require('lodash');

var getOrder = function (req, res, next) {
    var orderId = req.query.id;
    return orderService.searchOrder({orderId :orderId})
        .then(function (order) {
            return res.json(order);
        })
        .catch(function (err) {
            return next(err);
        });
};


var deletOrder = function (req, res, next) {
    var orderId = req.query.id;
    return orderService.deleteOrder(orderId)
        .then(function (result) {
            if (_.get(result.result, 'n') == 0) {
                return res.json({'No order found with id': orderId});
            }
            return res.json({
                'Order delete with Order Id': orderId,
                'Number of Orders deleted': _.get(result.result, 'n')
            });
        })
        .catch(function (err) {
            return next(err);
        })
};

var addOrder = function (req, res, next) {
    var orderJson = req.body;
    return orderService.addOrder(orderJson)
        .then(function (savedOrder) {
            return res.json(savedOrder);
        })
        .catch(function (err) {
            return next(err);
        });
};

var addBulkOrder = function (req, res, next) {
    var ordersFile = req.file.path;
    var processedOrderArray = [];
    fs.createReadStream(ordersFile)
        .pipe(csv())
        .on('data', function (data) {
            processedOrderArray.push(data);
        })
        .on('end', function () {
            console.log('All records read');
            return orderService.addBulkOrder(processedOrderArray)
                .then(function (savedOrders) {
                    return res.json(savedOrders);
                })
                .catch(function (err) {
                    return next(err);
                });
        });
};

var search = function (req, res, next) {
    var query = req.query;
    return orderService.searchOrder(query)
        .then(function (result) {
            return res.json(result);
        })
        .catch(function (err) {
            return next(err);
        })
};

var listOrderItemVsFrequency = function (req, res, next) {
    var filter = unescape(req.query.filter);
    return orderService.listOrderItemVsFrequency(filter)
        .then(function (result) {
            return res.json(result);
        })
        .catch(function (err) {
            return next(err);
        })
};

var init = function (req, res, next) {
    return orderService.initOrder()
        .then(function (orders) {
            return res.json(orders);
        })
        .catch(function (err) {
            return next(err);
        });
};

module.exports = {
    getOrder: getOrder,
    search: search,
    deleteOrder: deletOrder,
    addOrder: addOrder,
    addBulkOrder: addBulkOrder,
    listOrderItemVsFrequency: listOrderItemVsFrequency,
    init: init
};