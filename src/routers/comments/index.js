const express = require("express");
const Comments = require("../../models/comment");
const fs = require("fs");
const commentsRouter = express.Router();

commentsRouter.get("/posts/id/comment", async (req, res) => {
    const posts = await Post.find({});
    res.send(posts);
});
// commentsRouter.post("/posts/id/comment", async (req, res) => {
//
//     commentsRouter.put("/posts/id/comment", async (req, res) => {
//         commentsRouter.put("/posts/id/comment", async (req, res) => {
//         }

module.exports=commentsRouter;
