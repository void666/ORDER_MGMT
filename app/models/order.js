var mongoose = require('mongoose');

/**
 * Order Schema
 */

var OrderSchema ={
    order_id: {type: String, default: '', required : true},
    customer_address : {type: String, default: '', required : true},
    order_item : {type : String, default : '', required : true},
    company_name : {type : String , default : '', required : true},
    date: {type : Date, default : new Date(), required : true}
};

module.exports = mongoose.model('Order' , OrderSchema);