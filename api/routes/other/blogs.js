const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const commonauth= require('../../config/auth_middleware').commonauth

const Blog = require("../../models/blogs");

router.get("/a", (req, res) => {
    Blog.find({})
        .select('_id title content')
        .exec()
        .then((blog) => {
            res.send(blog);
        });
});


router.get("/new_blog",(req,res)=>{
    res.render("newblog");
})

router.post("/new_blog", commonauth, (req, res) => {
    const blog = new Blog({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        content: req.body.content,
        author: req.userid 
    });
    blog.save()
        .then((result) => {
            console.log(result);
            res.redirect('/blogs/'+result._id)
        })
        .catch((result) => {
            console.log(result);
        });
});

router.get("/:ID", (req, res) => {
    Blog.findById(req.params.ID)
        .exec()
        .then((blog) => {
            res.render('blog',blog);
        });
});


router.patch("/:ID/edit", (req, res) => {
    Blog.findById(req.params.ID)
        .exec()
        .then((blog) => {
            blog.title= req.body.title;
            blog.content=req.body.content;
            return blog.save();
        })
        .then((result) => {
            console.log(result);
        })
        .catch((result) => {
            console.log(result);
        });
});


router.get("/:ID/delete_blog", (req, res) => {
    Blog.findByIdAndRemove(req.params.ID)
        .exec()
        .then((result) => {
            //res.send(result);
            console.log(result);
            res.redirect('/')
        })
        .catch((result) => {
            res.send(result);
            console.log(result);
        });
});

module.exports = router;