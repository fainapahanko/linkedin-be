const express = require("express")
const router = express.Router({mergeParams: true})
const path = require("path")
const fs = require("fs-extra")
const multer = require("multer")
const json2csv = require("json2csv").parse;
const Experience = require("../../models/experience")
const Profiles = require("../../models/profiles")
const passport = require('passport')

router.get("/", async(req,res) => {
    try{
        const experience = await Experience.find({username: req.params.username});
        res.status(200).send(experience)
    } catch(err){
        res.send(err)
    }
});

router.get("/:id", async(req,res) => {
    try{
        const experience = await Experience.findOne({_id: req.params.id})
        res.status(200).send(experience)
    } catch(err){
        res.send(err)
    }
});

router.post("/", passport.authenticate('jwt'), async(req,res) => {
    try{
        if(req.user.username !== req.params.username) res.status(404).send('User not found')
        const obj = {
            ...req.body,
            username: req.user.username,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const newExperience = await Experience.create(obj)
        const user = await Profiles.updateOne(
            { username: req.params.userName },
            { $push: { "experience" : newExperience._id } }
        )
        user.save()
        newExperience.save();
        res.status(200).send(newExperience)
    } catch(err) {
        res.send(err)
    }
})

const upload = multer({})
router.post("/:id/picture",passport.authenticate('jwt'), upload.single("experience"), async(req,res) => {
    try{
        if(req.user.username !== req.params.username) res.status(404).send('User not found')
        const imgDest = path.join(__dirname,"../../../image/experience/", "image.jpg");
        const imgDestination = req.protocol + "://" + req.get("host") + "/image/experience/" + req.params.id + req.file.originalname;
        await fs.writeFile(imgDest, req.file.buffer);
        await Experience.findOneAndUpdate({_id: req.params.id}, {image: imgDestination},{useFindAndModify: false, new: true});
        const profile = await Profiles.findOne({username: req.params.username})
        res.send({
            profile
        })
    } catch(err){
        res.send(err)
    }
})

router.put("/:id/picture",passport.authenticate('jwt'), upload.single("experience"), async(req,res) => {
    try{
        if(req.user.username !== req.params.username) res.status(404).send('User not found')
        const imgDest = path.join(__dirname,"../../../image/experience/", "image.jpg");
        const imgDestination = req.protocol + "://" + req.get("host") + "/image/experience/" + req.params.id + req.file.originalname;
        await fs.writeFile(imgDest, req.file.buffer);
        await Experience.findOneAndUpdate({_id: req.params.id}, {image: imgDestination},{useFindAndModify: false, new: true});
        const profile = await Profiles.findOne({username: req.params.username})
        res.send({
            profile
        })
    } catch(err){
        res.send(err)
    }
})

router.put("/:id",passport.authenticate('jwt'), async(req,res) => {
    try{
        if(req.user.username !== req.params.username) res.status(404).send('User not found')
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

router.delete("/:id",passport.authenticate('jwt'), async(req,res) => {
    try{
        if(req.user.username !== req.params.username) res.status(404).send('User not found')
        const exp = await Experience.findByIdAndRemove({_id: req.params.id})
        if(exp) res.status(200).send("deleted")
        else res.status(404).send("Not found")
    } catch(err) {
        res.send(err)
    }
})

module.exports = router
