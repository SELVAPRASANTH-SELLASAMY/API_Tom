const mongoose = require('mongoose')
const AdminSchema = mongoose.Schema(
    {
        username:{
            type:String,
            require:[true,"Username couldn't be empty"]
        },
        password:{
            type:String,
            require:[true,"Password couldn't be empty"]
        }
    },
    {
        timestamps:true
    }
)
const AdminModel = mongoose.model("Administrator",AdminSchema)
module.exports = AdminModel