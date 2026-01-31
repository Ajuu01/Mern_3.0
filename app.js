require("dotenv").config();

const express=require('express');
const app=express();

app.use(express.json())

const connectToDatabase = require('./database');
const Blog = require("./model/blogModel");
connectToDatabase();

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Hello from Here"
    });
})

app.post("/blog",async(req,res)=>{
    const{title,subtitle,description,image}=req.body
    await Blog.create({
        title:title,
        subtitle:subtitle,
        description:description,
        image:image
    })
    res.status(200).json({
        message:"Blog api hit successfully"
    })

})

app.listen((process.env.PORT),()=>{
    console.log("NODEJS Project has started.")
})

