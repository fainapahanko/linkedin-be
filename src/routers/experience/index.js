const express = require("express")
const router = express.Router({mergeParams: true})
const multer = require("multer")
const Experience = require("../../models/experience")
const MulterAzureStorage = require('multer-azure-storage')
const Profiles = require("../../models/profiles")
const passport = require('passport')
const dotenv = require('dotenv')
dotenv.config()

const upload = multer({
    storage: new MulterAzureStorage({
      azureStorageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
      containerName: 'experience',
      containerSecurity: 'blob',
    })
})

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
        const exp = await Experience.create(obj)
        const user = await Profiles.findOneAndUpdate(
            { username: req.user.username },
            { $push: { "experiences" : exp._id } }
        ).populate('experiences')
        res.status(200).send(user)
    } catch(err) {
        res.send(err)
    }
})

router.post("/:id/picture",passport.authenticate('jwt'), upload.single("experience"), async(req,res) => {
    try{
        if(req.user.username !== req.params.username) res.status(404).send('User not found')
        const exp = await Experience.findOneAndUpdate({_id: req.params.id}, {image: req.file.url},{useFindAndModify: false, new: true});
        res.send({
            exp
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
