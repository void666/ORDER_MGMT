var _ = require('lodash');
var Order = require('../models/order');
var ORDER_AGGREGATION = require('../models/order.aggregation');
var ORDER_ENUMS = require('../enums/order.enum');
var staticOrders =  require('./static.orders');

var _buildQuery = function (searchParams) {
    var query = {};
    var searchParamKeys = _.keys(searchParams);
    _.each(searchParamKeys, function (key) {
        var att = _.get(ORDER_ENUMS.PARAMS_TO_ATTRIBUTE, key);
        query[att] = searchParams[key];
    });
    return query;
};

var _buildOrderObject = function (orderAttributes) {
    var orderObject = {
        order_id: orderAttributes[0],
        company_name: orderAttributes[1],
        customer_address: orderAttributes[2],
        order_item: orderAttributes[3]
    };
    return orderObject;
};

var addBulkOrder = function (processedOrdersArray) {
    var ordersObjects = [];
    _.each(processedOrdersArray, function (order) {
        ordersObjects.push(_buildOrderObject(order));
    });
    return Order.insertMany(ordersObjects);
};

var addOrder = function (orderJson) {
    var orderObject = {
        order_id: orderJson.orderId,
        company_name: orderJson.companyName,
        customer_address: orderJson.customerAddress,
        order_item: orderJson.orderItem
    };
    var order = new Order(orderObject);
    return order.save();
};


var deleteOrder = function (orderId) {
    return Order.remove({order_id: orderId}).exec();
};

var listOrderItemVsFrequency = function (param) {
    return Order.aggregate(ORDER_AGGREGATION.aggsListAttributeVsFrequency(param))
        .then(function (result) {
            return _.values(result);
        })
        .catch(function (err) {
            console.log(err);
            return [];
        });
};

var searchOrder = function (searchParams) {
    var query = _buildQuery(searchParams);
    return Order.find(query)
        .skip(searchParams.skip ? searchParams.skip : 0) //pagination support
        .limit(searchParams.limit ? searchParams.limit : 0)//pagination support
        .lean().exec();
};

var distinct = function (attribute) {
    return Order.find().distinct(attribute).exec();
};

var initOrder = function () {
    return Order.find({}).lean().exec()
        .then(function (orders) {
            if (orders.length > 0) {
                return orders;
            }
            else {
                return Order.insertMany(staticOrders);
            }
        });
};

module.exports = {
    addBulkOrder: addBulkOrder,
    addOrder: addOrder,
    deleteOrder: deleteOrder,
    searchOrder: searchOrder,
    listOrderItemVsFrequency: listOrderItemVsFrequency,
    distinct: distinct,
    initOrder: initOrder
};