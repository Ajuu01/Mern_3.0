require("dotenv").config();

const express=require('express');
const app=express();

app.use(express.json())

const connectToDatabase = require('./database');
const Blog = require("./model/blogModel");
connectToDatabase();

const{multer,storage}=require('./middleware/multerConfig')
const upload=multer({storage:storage})

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Hello from Here"
    });
})

app.post("/blog",upload.single('image'), async(req,res)=>{
    const{title,subtitle,description,image}=req.body
    const filename=req.file.filename
    if(!title || !subtitle || !description){
        return res.status(400).json({
            message:"No empty field allowed."
        })
    }
    await Blog.create({
        title:title,
        subtitle:subtitle,
        description:description,
        image:filename
    })
    res.status(200).json({
        message:"Blog api hit successfully"
    })

})

app.get('/blog',async(req,res)=>{
    const blogs=await Blog.find();
    res.status(200).json({
        message:("Blogs fetched successfully"),
        data:blogs
    })
    app.use(express.static('./storage'))
})
app.listen((process.env.PORT),()=>{
    console.log("NODEJS Project has started.")
})

