// require("dotenv").config();
const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const connectToDatabase = require("./database/index.js");
const Blog = require("./model/blogModel");
const { multer, storage } = require("./middleware/multerConfig");

const upload = multer({ storage: storage });

// Connect to MongoDB
connectToDatabase();

// Middleware
app.use(express.json());
app.use("/storage", express.static("./storage"));
app.use(cors({ origin: ["http://localhost:5173"] }));

// Create blog
app.post("/blog", upload.single("image"), async (req, res) => {
  const { title, subtitle, description } = req.body;
  if (!title || !subtitle || !description) return res.status(400).json({ message: "Fields required" });

  let image = req.file ? `/storage/${req.file.filename}` : "";
  
  const blog = await Blog.create({ title, subtitle, description, image });
  res.status(200).json({ message: "Blog created", data: blog });
});

// Get all blogs
app.get("/blog", async (req, res) => {
  const blogs = await Blog.find();
  res.status(200).json({ data: blogs });
});

// Get blog by ID
app.get("/blog/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Not found" });
  res.status(200).json({ data: blog });
});

// Delete blog
app.delete("/blog/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Not found" });

  if (blog.image && fs.existsSync(`.${blog.image}`)) fs.unlinkSync(`.${blog.image}`);
  await Blog.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Deleted" });
});

// Update blog
app.patch("/blog/:id", upload.single("image"), async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Not found" });

  const { title, subtitle, description } = req.body;
  let image = blog.image;

  if (req.file) {
    if (blog.image && fs.existsSync(`.${blog.image}`)) fs.unlinkSync(`.${blog.image}`);
    image = `/storage/${req.file.filename}`;
  }

  const updated = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, subtitle, description, image },
    { new: true }
  );

  res.status(200).json({ message: "Updated", data: updated });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
