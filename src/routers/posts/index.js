const express = require("express");
const Post = require("../../models/posts");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const postsRouter = express.Router();

postsRouter.get("/", async (req, res) => {
    const posts = await Post.find({});
    res.send(posts);
});

postsRouter.get("/:postId", async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (post) {
            res.send(post);
        } else {
            res.status(404).send("Not found");
        }
    } catch (error) {
        console.log();
        res.send(error)
    }
});
postsRouter.post("/:id", async (req, res) => {
    try {
        const newPost = await Post.create(req.body);
        console.log(req.body);
        newPost.save();
        res.send(newPost);
    } catch (error) {
        res.status(500).send(error);
    }
});

postsRouter.put("/:postId", async (req, res) => {

    try {
        const post = await Post.findOneAndUpdate(
            { _id: req.params.postId },
            { $set: { ...req.body } },
            {new: true}
        );
        res.send(post);
    } catch (error) {
        res.status(400).send(error);
    }
});

postsRouter.delete("/:postId", async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.postId });
        res.send(post);
    } catch (error) {
        res.status(400).send(error);
    }
});
const upload = multer({});
postsRouter.post("/:postId/picture", upload.single("image"), async (req, res) => {
        //console.log(req);
        try {
            const imgDest = path.join(__dirname, "../../../img/posts" + req.params.postId + req.file.originalname);
            const imgDestination = req.protocol + "://" + req.get("host") + "/img/posts/" + req.params.postId + req.file.originalname;
            await fs.writeFileSync(imgDest, req.file.buffer);
            console.log(imgDestination);
            const exp = await Post.findOneAndUpdate({username: req.params.postId}, {image: imgDestination}, {new: true, useFindAndModify: false});
            res.send(exp)
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    });

module.exports = postsRouter;