var _ = require('lodash');
var ORDER_ENUM = require('../enums/order.enum');

/**
 * Generic Aggregation query template.
 * @param order attribute on which the aggregation will run
 * @return {aggregation query}
 */

var aggsListAttributeVsFrequency = function(param){
    var attribute = _.get(ORDER_ENUM.PARAMS_TO_ATTRIBUTE, param);
    return [
        { $group : {_id : '$' + attribute, total : {$sum : 1}}},
        { $sort : {total : -1}}
    ]
};

module.exports = {
    aggsListAttributeVsFrequency : aggsListAttributeVsFrequency
};