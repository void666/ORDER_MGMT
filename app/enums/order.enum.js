var _ = require('lodash');

/**
 * Map for params vs db record attributes
 * @type {{orderId: string, orderItem: string, customerAddress: string, companyName: string}}
 */

var paramToAttMap = {
  orderId : 'order_id',
  orderItem : 'order_item',
  customerAddress : 'customer_address',
  companyName : 'company_name'
};

module.exports = {
    PARAMS_TO_ATTRIBUTE : _.cloneDeep(paramToAttMap)
};