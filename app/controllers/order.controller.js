var orderService = require('./../services/order.server.service');
var fs = require('fs');
var csv = require('fast-csv');
var _ = require('lodash');

/**
 * Get Order By Order ID
 * @param req
 * @param res
 * @param next
 * @return {Promise : Fetch Orders for OrderIDs}
 */

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

/**
 * Delete Order By Order Id
 * @param req
 * @param res
 * @param next
 * @return {Result contains number of records deleted. If NO records found by ID, states No Records Found}
 */

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
        });
};

/**
 * Add singular Order
 * @param req
 * @param res
 * @param next
 * @return {Returns order which is added}
 */

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

/**
 * Add Bulk Orders via CSV file (POST call)
 * @param req
 * @param res
 * @param next
 * @returns {Orders saved}
 */

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

/**
 *  Search Orders based on the filters
 * @param req
 * @param res
 * @param next
 * @return {Orders which matched the search criteria}
 */

var search = function (req, res, next) {
    var query = req.query;
    return orderService.searchOrder(query)
        .then(function (result) {
            return res.json(result);
        })
        .catch(function (err) {
            return next(err);
        });
};

/**
 * Fetch List of Order Attributes(filter) vs their Occurrence Frequency in Descending order
 * @param req
 * @param res
 * @param next
 * @return {Returns Attribute Vs Occurrence Frequency, List}
 */

var listOrderAttributeVsFrequency = function (req, res, next) {
    var filter = unescape(req.query.filter);
    return orderService.listOrderAttributeVsFrequency(filter)
        .then(function (result) {
            return res.json(result);
        })
        .catch(function (err) {
            return next(err);
        });
};

/**
 * Checks if there are any orders in the DB. If not, generates from static.data.
 * @param req
 * @param res
 * @param next
 * @return {Returns list of All orders or generated ones}
 */

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
    listOrderAttributeVsFrequency: listOrderAttributeVsFrequency,
    init: init
};