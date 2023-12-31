const mongoose = require('mongoose')
const userMessageSchema = mongoose.Schema(
    {
        name:{
            type:String,
            require:[true,"Username couldn't be empty"]
        },
        email:{
            type:String,
            require:[true,"Email couldn't be empty"]
        },
        phonenumber:{
            type:Number,
            require:[true,"Phone number couldn't be empty"]
        },
        message:{
            type:String,
            require:[true,"Message couldn't be empty"]
        }
    },
    {
        timestamps:true
    }
)
const userMessage = mongoose.model("user_messages",userMessageSchema)
module.exports = userMessage