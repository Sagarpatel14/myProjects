const express = require('express');
const router = express.Router();

const authorController= require("../controllers/authorController")
const blogController= require("../controllers/blogController")


router.post("/authors", authorController.createAuthor)
router.post("/blogs", blogController.createBlog)
router.get("/blogs", blogController.getBlogs)
router.put("/blogs/:blogId", blogController.updatedBlogs)
router.delete("/blogs/:blogId" , blogController.deleteBlog)
router.delete("/blogs" , blogController.deleteBlogByQuery)

module.exports = router;