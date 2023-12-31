const express = require('express')
const mongoose = require('mongoose')
const messages = require('./Models/UserMessage')
const administrator = require('./Models/Admin')
const {CreateToken,VerifyToken,prev} = require('./AccessToken')
const App = express()
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const path = require('path')
require('dotenv').config()
App.use(express.json())
App.use(cookieParser())
App.use(express.static('views'))
const port = process.env.PORT
App.listen(port,()=>{
    console.log(`API TOM awaked on port ${port}`)
})
App.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,'/views/index.html'))
})
App.get("/tomImage",(req,res)=>{
    res.sendFile(path.join(__dirname,'/views/1j5bkn.jpg'))
})
App.get("/tomImage1",(req,res)=>{
    res.sendFile(path.join(__dirname,'/views/tim.png'))
})

//db connection
mongoose.connect("mongodb://localhost:27017/Tom").
then(()=>{
    console.log("Connected to the mongodb database")
}).
catch((error)=>{
    console.log("Something went wrong : "+error)
})

//End points for portfolio

//Endpoint used to send message to the database
App.post("/sendmessage",async(req,res)=>{
    try{
        const message = await messages.create(req.body)
        if(message){
            return res.status(200).json(message)
        }
        else{
            return res.status(400).json({error:"Something went wrong while trying to create users message object"})
        }
    }
    catch(error){
        console.log("Something went wrong "+error)
        res.status(400).json({error:error})
    }
})

//Endpoint to receive messages from database
App.get("/receivemessage",VerifyToken,async(req,res)=>{
    try{
        const message = await messages.find()
        if(message){
            return res.status(200).json(message)
        }
        else{
            return res.status(400).json({error:"Something went wrong"})
        }
    }
    catch(err){
        return res.status(400).json({error:err})
    }
})

//Endpoint to create admin user for message access
App.post("/adminregistration",prev,async(req,res)=>{
    const {username,password} = req.body
    bcrypt.hash(password,10).then(async(hashvalue)=>{
        const admin = await administrator.create({username:username,password:hashvalue})
        res.status(200).json(admin)
    }).catch((err)=>{
        res.status(400).json({Error:err})
    })
})

//Endpoint for Admin login

App.post("/adminlogin",async(req,res)=>{
    const {username,password} = req.body
    //check whether the user is available
    try{
        const isavail = await administrator.find({username:username})
        if(!isavail){
            return res.status(400).json({Error:"User not found!"})
        }
        if(isavail.length > 1){
            return res.status(400).json({Error:"Something looks like bad request"})
        }
        var dbpassword
        isavail.map((obj)=>(
            dbpassword = obj.password
        ))
        const comp = await bcrypt.compare(password,dbpassword)
        if(!comp){
            return res.status(400).json({Error:"Invalid username or password"})
        }
        const tkn = CreateToken(username)
        if(!tkn){
            return res.status(400).json({Error:"Error while generating JWT"})
        }
        res.cookie("Access_Token",tkn,{
            maxAge:60*1000,
            httpOnly:true
        })
        return res.status(200).json({state:"Allowed"})
    }
    catch(err){
        res.status(400).json({Error:err})
    }
})