const mongoose = require('mongoose')
const EmployeeSessionSchema = new mongoose.Schema({
    employee : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'employees'
    },
    token_parsed : String,
    init_time : Date,
    expire : Date,
})
module.exports=mongoose.model('employee_sessions',EmployeeSessionSchema)

