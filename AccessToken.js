const jwt = require('jsonwebtoken')
require('dotenv').config()
const CreateToken = (user) =>{
    try{
        const token = jwt.sign(user,process.env.SECRET_KEY)
        return token
    }
    catch(err){
        console.log(err)
        return false
    }
}
//middleware to check the user authentication
const VerifyToken = (req,res,next) =>{
    try{
        const token = req.cookies["Access_Token"]
        if(!token){
            res.status(400).json({Error:"Token not found"})
        }
        const isValid = jwt.verify(token,process.env.SECRET_KEY)
        if(isValid){
            // res.authenticated = true
            return next()
        }
        else{
            res.status(400).json({Error:"Authentication failed"})
        }
    }
    catch(error){
        console.log(error)
        res.status(400).json({Error:"Something went wrong"})
    }
}
//Middleware to prevent unauthorised user registration
const prev = (req,res,next) =>{
    const {passkey} = req.body
    if(!passkey){
        return res.status(400).json({Error:"Unauthorised request"})
    }
    if(passkey === process.env.AUTH_KEY){
        return next()
    }
    else{
        return res.status(400).json({Error:"Unauthorised request"})
    }
}
module.exports = {CreateToken,VerifyToken,prev}