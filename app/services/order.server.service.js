var _ = require('lodash');
var Order = require('../models/order');
var ORDER_AGGREGATION = require('../models/order.aggregation');
var ORDER_ENUMS = require('../enums/order.enum');
var staticOrders =  require('./static.orders');

/**
 * Takes in the searchParams and builds a query based on the params
 * @param searchParams
 * @return {ready query}
 * @private
 */

var _buildQuery = function (searchParams) {
    var query = {};
    var searchParamKeys = _.keys(searchParams);
    _.each(searchParamKeys, function (key) {
        var att = _.get(ORDER_ENUMS.PARAMS_TO_ATTRIBUTE, key);
        query[att] = searchParams[key];
    });
    return query;
};

/**
 * builds CSV rows to orders (db compatible objects)
 * @param orderAttributes
 * @return {{order_id: *, company_name: *, customer_address: *, order_item: *}}
 * @private
 */

var _buildOrderObject = function (orderAttributes) {
    var orderObject = {
        order_id: orderAttributes[0],
        company_name: orderAttributes[1],
        customer_address: orderAttributes[2],
        order_item: orderAttributes[3]
    };
    return orderObject;
};

/**
 * takes in the csv processed orders and performs bulk insert
 * @param processedOrdersArray
 * @return {*}
 *
 */

var addBulkOrder = function (processedOrdersArray) {
    var ordersObjects = [];
    _.each(processedOrdersArray, function (order) {
        ordersObjects.push(_buildOrderObject(order));
    });
    return Order.insertMany(ordersObjects);
};

/**
 * formats orderJson into valid a Order db object, inserts in db.
 * @param orderJson
 * @return {*}
 */

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


/**
 * Takes order ID and deletes the order, if found.
 * @param orderId
 * @return {*|Promise|Array|{index: number, input: string}}
 */
var deleteOrder = function (orderId) {
    return Order.remove({order_id: orderId}).exec();
};

/**
 * returns list of Attribute Values vs Occurrence Frequency
 * @param param
 * @return {}
 */

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

/**
 * Builds search query based on searchParams and returns the list of orders.
 * @param searchParams
 * @return {Promise}
 */

var searchOrder = function (searchParams) {
    var query = _buildQuery(searchParams);
    return Order.find(query)
        .skip(searchParams.skip ? searchParams.skip : 0) //pagination support
        .limit(searchParams.limit ? searchParams.limit : 0)//pagination support
        .lean().exec();
};


//TODO : To be used for UI filter generation
/**
 * For Filter values purpose. Provides the list of distinct Values for the attribute passed.
 * @param attribute
 * @return {}
 */

var distinct = function (attribute) {
    return Order.find().distinct(attribute).exec();
};

/**
 * Checks if there are any orders in the DB. If not, generates from static.data.
 */

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
    listOrderAttributeVsFrequency: listOrderItemVsFrequency,
    distinct: distinct,
    initOrder: initOrder
};