// require('dotenv').config()
// const express = require('express')
// const connectToDatabase = require('./database')

// const app = express()
// app.use(express.json())

// const { multer, storage } = require('./middleware/multerConfig')
// const upload = multer({ storage })

// const Blog = require('./model/blogModel')
// const fs = require('fs')
// const cors = require('cors')

// /* -------------------- CORS -------------------- */
// app.use(
//   cors({
//     origin: [
//       'http://localhost:5173',
//       'https://blog-beige-two-18.vercel.app'
//     ]
//   })
// )

// /* -------------------- DB -------------------- */
// connectToDatabase()

// /* -------------------- STATIC -------------------- */
// app.use('/storage', express.static('storage'))

// /* -------------------- ROUTES -------------------- */

// app.get('/', (req, res) => {
//   res.json({ message: 'API running' })
// })

// /* -------- CREATE BLOG -------- */
// app.post('/blog', upload.single('image'), async (req, res) => {
//   try {
//     const { title, subtitle, description } = req.body

//     if (!title || !subtitle || !description) {
//       return res.status(400).json({ message: 'All fields required' })
//     }

//     const image = req.file ? req.file.filename : 'image.png'

//     await Blog.create({
//       title,
//       subtitle,
//       description,
//       image
//     })

//     res.status(201).json({ message: 'Blog created successfully' })
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// })

// /* -------- GET ALL BLOGS -------- */
// app.get('/blog', async (req, res) => {
//   const blogs = await Blog.find()
//   res.json({ data: blogs })
// })

// /* -------- GET SINGLE BLOG -------- */
// app.get('/blog/:id', async (req, res) => {
//   const blog = await Blog.findById(req.params.id)
//   if (!blog) {
//     return res.status(404).json({ message: 'Blog not found' })
//   }
//   res.json({ data: blog })
// })

// /* -------- DELETE BLOG -------- */
// app.delete('/blog/:id', async (req, res) => {
//   const blog = await Blog.findById(req.params.id)

//   if (!blog) {
//     return res.status(404).json({ message: 'Blog not found' })
//   }

//   if (blog.image !== 'image.png') {
//     fs.unlink(`storage/${blog.image}`, err => {
//       if (err) console.log(err)
//     })
//   }

//   await Blog.findByIdAndDelete(req.params.id)
//   res.json({ message: 'Blog deleted successfully' })
// })

// /* -------- UPDATE BLOG -------- */
// app.patch('/blog/:id', upload.single('image'), async (req, res) => {
//   const { title, subtitle, description } = req.body
//   const blog = await Blog.findById(req.params.id)

//   if (!blog) {
//     return res.status(404).json({ message: 'Blog not found' })
//   }

//   let image = blog.image

//   if (req.file) {
//     image = req.file.filename

//     if (blog.image !== 'image.png') {
//       fs.unlink(`storage/${blog.image}`, err => {
//         if (err) console.log(err)
//       })
//     }
//   }

//   await Blog.findByIdAndUpdate(req.params.id, {
//     title,
//     subtitle,
//     description,
//     image
//   })

//   res.json({ message: 'Blog updated successfully' })
// })

// /* -------------------- SERVER -------------------- */
// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`)
// })

require('dotenv').config()
const express = require('express')
const connectToDatabase = require('./database')

const app = express() 
app.use(express.json())
const {multer,storage} = require('./middleware/multerConfig')
const Blog = require('./model/blogModel')
const upload = multer({storage : storage })
const fs = require('fs')
const cors = require('cors')

app.use(cors(
    {
        origin : ["http://localhost:5173","https://blog-beige-two-18.vercel.app"]
    }
))

connectToDatabase()

app.get("/",(req,res)=>{
    res.status(200).json({
        hello : "This is home page"
    })
})

app.post("/blog",upload.single('image'), async (req,res)=>{
   const {title,subtitle,description} = req.body 
   let filename;
   if(req.file){
     filename = "https://mern-3-0-1.onrender.com/" + req.file.filename 
   }else{
    filename = "https://cdn.mos.cms.futurecdn.net/i26qpaxZhVC28XRTJWafQS-1200-80.jpeg"
   }

   if(!title || !subtitle || !description){
        return res.status(400).json({
            message : "Please provide title,subtitle,description"
        })
        
   }
   await Blog.create({
    title : title, 
    subtitle : subtitle, 
    description : description, 
    image : filename
   })
    res.status(200).json({
        message : "Blog api hit successfully"
    })
})

app.get("/blog",async (req,res)=>{
   const blogs =  await Blog.find() // returns array
   res.status(200).json({
    message : "Blogs fetched successfully", 
    data : blogs
   })
})

app.get("/blog/:id",async (req,res)=>{
    const id = req.params.id
    const blog =  await Blog.findById(id) // object

    if(!blog){
        return res.status(404).json({
            message : "no data found"
        })
    }

    res.status(200).json({
        message : "Fetched successfully", 
        data : blog
    })
  
})
app.delete("/blog/:id",async (req,res)=>{
    const id = req.params.id
    const blog = await Blog.findById(id)
    const imageName = blog.image
 
    fs.unlink(`storage/${imageName}`,(err)=>{
        if(err){
            console.log(err)
        }else{
            console.log("File deleted successfully")
        }
    })
    await Blog.findByIdAndDelete(id)
    res.status(200).json({
        message : 'Blog deleted successfully'
    })
})

app.patch('/blog/:id',upload.single('image'), async(req,res)=>{
    const id = req.params.id 
    const {title,subtitle,description} = req.body 
    let imageName;
    if(req.file){
        imageName= "https://mern-3-0-1.onrender.com/" + req.file.filename
        const blog = await Blog.findById(id)
        const oldImageName = blog.image
    
        fs.unlink(`storage/${oldImageName}`,(err)=>{
            if(err){
                console.log(err)
            }else{
                console.log("File deleted successfully")
            }
        })
    }
   await Blog.findByIdAndUpdate(id,{
        title : title, 
        subtitle : subtitle, 
        description : description, 
        image : imageName
    })
    res.status(200).json({
        message : "Blog updated successfully"
    })
})



app.use(express.static('./storage'))

app.listen(process.env.PORT,()=>{
    console.log("NodeJs project has started")
})

// mongodb+srv://digitalpathshala:<password>@cluster0.iibdr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0