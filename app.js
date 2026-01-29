const express=require('express');
const app=express()

app.get("/",(req,res)=>{
    res.json({
        message:"Hello from Here"
    });
})
app.get("/about",(req,res)=>{
    res.json({
        message:"This is about page"
    });
})



app.listen(3000,()=>{
    console.log("NODEJS Project has started.")
})
