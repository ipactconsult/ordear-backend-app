const mongoose = require('mongoose')
const PaymentSchema = mongoose.Schema({
    PayAmount : BigInt,
    PayDate : Date,
    PayType : String,
    Customer_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'customers'
    },
    Order_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'orders'
    }
})
module.exports=mongoose.model('payments',PaymentSchema)