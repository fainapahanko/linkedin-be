const express = require("express")
const router = express.Router()
const path = require("path")
const fs = require("fs-extra")
const multer = require("multer")
const json2csv = require("json2csv").parse;
const Experience = require("../../models/experience")
const User = require("../../models/users")

router.get("/", async(req,res) => {
    try{
        const experience = await Experience.find({})
        res.status(200).send(experience)
    } catch(err){
        res.send(err)
    }
})

router.get("/:userName", async(req,res) => {
    try{
        const experience = await Experience.find({username: req.params.userName})
        res.status(200).send(experience)
    } catch(err){
        res.send(err)
    }
})

router.get("/:userName/:id", async(req,res) => {
    try{
        const experience = await Experience.findOne({_id: req.params.id})
        res.status(200).send(experience)
    } catch(err){
        res.send(err)
    }
})

router.post("/:userName", async(req,res) => {
    try{
        const obj = {
            ...req.body,
            username: req.params.userName,
            image: "http://trensalon.ru/pic/defaultImage.png",
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const newExperience = await Experience.create(obj)
        const user = await User.updateOne(
            { username: req.params.userName }, 
            { $push: { "experience" : newExperience._id } }
        )
        user.save()
        newExperience.save()
        res.status(200).send(obj)
    } catch(err) {
        res.send(err)
    }
})

const upload = multer({})
router.post("/:userName/:id/picture", upload.single("image"), async(req,res) => {
    try{
        const imgDest = path.join(__dirname,"../../../img/" + req.params.id + req.file.originalname)
        const imgDestination = req.protocol + "://" + req.get("host") + "/img/" + req.params.id + path.extname(req.file.originalname);
        await fs.writeFile(imgDest, req.file.buffer)
        const exp = await Experience.findOneAndUpdate({_id: req.params.id}, {image: imgDestination})
        res.send(exp)
    } catch(err){
        res.send(err)
    }
})

router.put("/:userName/:id", async(req,res) => {
    try{
        delete req.body._id
        const obj = {
            ...req.body,
            userId: req.params.userId,
            image: "http://trensalon.ru/pic/defaultImage.png",
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const exp = await Experience.updateOne({_id: req.params.id}, {$set: {obj}})
        if(exp) res.status(200).send(exp)
        else res.status(404).send("Not found")
    } catch(err) {
        res.send(err)
    }
})

router.delete("/:userName/:id", async(req,res) => {
    try{
        const exp = await Experience.findByIdAndRemove({_id: req.params.id})
        if(exp) res.status(200).send("deleted")
        else res.status(404).send("Not found")
    } catch(err) {
        res.send(err)
    }
})

router.get("/csv/:userName/getCsv", async(req,res) => {
    try{
        const experience = await Experience.find({username: req.params.userName})
        const fields = ["username", "role", "company", "startDate", "endDate", "description", "area"];
        const opts = { fields }
        const csv = json2csv(experience, opts);
        res.send(csv)
    } catch(err){
        res.send(err)
    }
})

module.exports = router