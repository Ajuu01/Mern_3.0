require('dotenv').config()
const express = require('express')
const connectToDatabase = require('./database')

const app = express()
app.use(express.json())

const { multer, storage } = require('./middleware/multerConfig')
const upload = multer({ storage })

const Blog = require('./model/blogModel')
const fs = require('fs')
const cors = require('cors')

/* -------------------- CORS -------------------- */
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://blog-beige-two-18.vercel.app'
    ]
  })
)

/* -------------------- DB -------------------- */
connectToDatabase()

/* -------------------- STATIC -------------------- */
app.use('/storage', express.static('storage'))

/* -------------------- ROUTES -------------------- */

app.get('/', (req, res) => {
  res.json({ message: 'API running' })
})

/* -------- CREATE BLOG -------- */
app.post('/blog', upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, description } = req.body

    if (!title || !subtitle || !description) {
      return res.status(400).json({ message: 'All fields required' })
    }

    const image = req.file ? req.file.filename : 'image.png'

    await Blog.create({
      title,
      subtitle,
      description,
      image
    })

    res.status(201).json({ message: 'Blog created successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/* -------- GET ALL BLOGS -------- */
app.get('/blog', async (req, res) => {
  const blogs = await Blog.find()
  res.json({ data: blogs })
})

/* -------- GET SINGLE BLOG -------- */
app.get('/blog/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' })
  }
  res.json({ data: blog })
})

/* -------- DELETE BLOG -------- */
app.delete('/blog/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' })
  }

  if (blog.image !== 'image.png') {
    fs.unlink(`storage/${blog.image}`, err => {
      if (err) console.log(err)
    })
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.json({ message: 'Blog deleted successfully' })
})

/* -------- UPDATE BLOG -------- */
app.patch('/blog/:id', upload.single('image'), async (req, res) => {
  const { title, subtitle, description } = req.body
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' })
  }

  let image = blog.image

  if (req.file) {
    image = req.file.filename

    if (blog.image !== 'image.png') {
      fs.unlink(`storage/${blog.image}`, err => {
        if (err) console.log(err)
      })
    }
  }

  await Blog.findByIdAndUpdate(req.params.id, {
    title,
    subtitle,
    description,
    image
  })

  res.json({ message: 'Blog updated successfully' })
})

/* -------------------- SERVER -------------------- */
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})