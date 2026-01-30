require('dotenv').config();

const express=require('express');
const connectToDatabase = require('./database');
const app=express()

connectToDatabase();

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Hello from Here"
    });
})
app.get("/about",(req,res)=>{
    res.json({
        message:"This is about page"
    });
})



app.listen(process.env.PORT,()=>{
    console.log("NODEJS Project has started.")
})

