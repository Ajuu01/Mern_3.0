require("dotenv").config();

const express=require('express');
const app=express();

app.use(express.json())

const connectToDatabase = require('./database');
connectToDatabase();

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Hello from Here"
    });
})

app.post("/blog",(req,res)=>{
    console.log(req.body)
    res.status(200).json({
        message:"Blog api hit successfully"
    })

})

app.listen((process.env.PORT),()=>{
    console.log("NODEJS Project has started.")
})

