const express = require('express');
const app=express()
const mongoose= require("mongoose")
const dotenv=require('dotenv')
dotenv.config()
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("mongodb is connected");
}).catch((err)=>{
    console.log("could not connect to the  mongodb");
})
app.get("/test",(req,res)=>{
    res.json("hello from server side")
})
app.listen(3001,()=>{
    console.log("server is running on port 3001!!")
})