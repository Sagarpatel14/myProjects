const express = require('express');
const router = express.Router();

const authorController= require("../controllers/authorController")
const blogController= require("../controllers/blogController")
const MW = require("../middlewares/auth")


router.post("/authors", authorController.createAuthor)
router.post("/login", authorController.loginAuthor)
router.post("/blogs", MW.mid1, blogController.createBlog)
router.get("/blogs", MW.mid1, blogController.getBlogs)
router.put("/blogs/:blogId", MW.mid1, MW.mid2, blogController.updatedBlogs)
router.delete("/blogs/:blogId", MW.mid1, MW.mid2, blogController.deleteBlog)
router.delete("/blogs", MW.mid1, MW.mid3, blogController.deleteBlogByQuery)

module.exports = router;