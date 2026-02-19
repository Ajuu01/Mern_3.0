require("dotenv").config();

const express=require('express');
const app=express();

app.use(express.json())
// app.use(express.static('./storage'))
// This makes files available at /storage/filename.jpg
// app.use('/storage', express.static('storage')); 

const connectToDatabase = require('./database/index.js');
const Blog = require("./model/blogModel");
const fs=require('fs')
const cors=require('cors')
connectToDatabase();

const{multer,storage}=require('./middleware/multerConfig')
const upload=multer({storage:storage})

app.use(cors(
    {
        origin:["http://localhost:5173","https://blog-beige-two-18.vercel.app"]
    }
))
app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Hello from Here"
    });
})

app.post("/blog",upload.single('image'), async(req,res)=>{
    const{title,subtitle,description,image}=req.body
    // const filename=req.file.filename
    let filename;
    if(req.file){
        filename="/storage/"+req.file.filename
    }
    else{
        filename="https://www.bbc.co.uk/news/technology-43085053"
    }
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
})

app.get('/blog/:id',async(req,res)=>{
    const id=req.params.id
    const blog=await Blog.findById(id)
    if(!blog){
        return res.status(404).json({
            message:"No blog found"
        })
    }
    res.status(200).json({
        message:("Blog fetched successfully"),
        data:blog
    })
})

app.delete("/blog/:id",async(req,res)=>{
    const id=req.params.id
    const blog=await Blog.findById(id)
    const imageName=blog.image
    await Blog.findByIdAndDelete(id)
    fs.unlink(`storage/${imageName}`,(err)=>{
        if(err){
            console.log("Error")
        }
        else{
            console.log("Image deleted successfully.")
        }
    })
    res.status(200).json({
        message:"Blog deleted successfully"
    })
})

app.patch("/blog/:id",upload.single('image'),async(req,res)=>{
    const id=req.params.id
    // const imgName=req.file.filename
    const{title,subtitle,description}=req.body
    const blog=await Blog.findById(id)
    const imageName=blog.image
    let imgName
    if(req.file){
        imgName="/storage/"+req.file.filename
    }
    else{
        imgName=imageName
    }
    await Blog.findByIdAndUpdate(id,{
        title:title,
        subtitle:subtitle,
        description:description,
        image:imgName
    })
    fs.unlink(`storage/${imageName}`,(err)=>{
        if(err){
            console.log("Error")
        }
        else{
            console.log("Image deleted successfully.")
        }
    })
    res.status(200).json({
        message:"Updated Successfully"
    })
})
app.use(express.static('./storage'))
app.listen((process.env.PORT),()=>{
    console.log("NODEJS Project has started.")
})

