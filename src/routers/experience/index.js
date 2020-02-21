const express = require("express")
const router = express.Router({mergeParams: true})
const path = require("path")
const fs = require("fs-extra")
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob")
const multer = require("multer")
const Experience = require("../../models/experience")
const MulterAzureStorage = require('multer-azure-blob-storage').MulterAzureStorage;
// const MulterAzureStorage = require('multer-azure-storage')
const Profiles = require("../../models/profiles")
const passport = require('passport')

const credentials = new StorageSharedKeyCredential("imageslinkedin", process.env.AZURE_STORAGE_KEY )
const blob = new BlobServiceClient("https://imageslinkedin.blob.core.windows.net/",  credentials)


const upload = multer({
    storage: new MulterAzureStorage({
    //   azureStorageConnectionString: process.env.AZURE_STORAGE,
    //   containerName: 'experience',
    //   containerSecurity: 'blob',
      connectionString: process.env.AZURE_STORAGE,
      accessKey: process.env.AZURE_STORAGE_KEY,
      accountName: 'imageslinkedin',
      containerName: 'experience',
      blobName: resolveBlobName,
      metadata: resolveMetadata,
      containerAccessLevel: 'blob',
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
        )
        console.log(exp)
        console.log(user)
        res.status(200).send(exp)
    } catch(err) {
        res.send(err)
    }
})

router.post("/:id/picture",passport.authenticate('jwt'), upload.single("experience"), async(req,res) => {
    try{
        if(req.user.username !== req.params.username) res.status(404).send('User not found')
        // const userExp = await Experience.findOne({_id: req.params.id})
        // if (userExp.image !== "http://www.gigabitmagazine.com/sites/default/files/styles/slider_detail/public/topic/image/GettyImages-1017193718_1.jpg?itok=W4-tjXij"){ 
        //     const container = blob.getContainerClient("experience"); 
        //     const urlParts = userExp.image.split("/")
        //     const filename = urlParts.reverse()[0]
        //     await container.deleteBlob(filename)
        // }
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
