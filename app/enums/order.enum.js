var _ = require('lodash');

var paramToAttMap = {
  orderId : 'order_id',
  orderItem : 'order_item',
  customerAddress : 'customer_address',
  companyName : 'company_name'
};

module.exports = {
    PARAMS_TO_ATTRIBUTE : _.cloneDeep(paramToAttMap)
};