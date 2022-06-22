const express = require('express');
const router = express.Router();
const authorController= require("../controllers/authorController")
const blogController= require("../controllers/blogController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/author", authorController.createAuthor )
router.post("/blogs", authorController.createBlog )
router.get("/blogs", blogController.getBlogs )
module.exports = router;