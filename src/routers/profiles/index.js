const express = require("express");
const Profile = require("../../models/profiles");
const Exp = require('../../models/experience')
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob")
const User = require('../../models/users')
const MulterAzureStorage = require('multer-azure-storage')
const profilesRouter = express.Router();
const multer = require("multer");
const passport = require('passport')
const dotenv = require('dotenv')
dotenv.config()

const credentials = new StorageSharedKeyCredential("imageslinkedin", process.env.AZURE_STORAGE_KEY )
const blob = new BlobServiceClient("https://imageslinkedin.blob.core.windows.net/",  credentials)

const resolveBlobName = (req, file) => {
    return new Promise((resolve, reject) => {
        const blobName = yourCustomLogic(req, file);
        resolve(blobName);
    });
};
 
const resolveMetadata = (req, file) => {
    return new Promise((resolve, reject) => {
        const metadata = yourCustomLogic(req, file);
        resolve(metadata);
    });
};

const upload = multer({
  storage: new MulterAzureStorage({
    azureStorageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
    containerName: 'profile',
    containerSecurity: 'blob'
  })
})

profilesRouter.get("/", async (req, res)=>{
    if (req.query.name)
         return res.send(await Profile.find({ name: req.query.name}));
    const profiles = await Profile.find({});
    res.send(profiles);
});

profilesRouter.get("/me", passport.authenticate('jwt',  {session: false}), async (req, res) => {
    const profile = await Profile.findOne({username: req.user.username}).populate('experiences');
    if (profile) {
        res.send(profile);
    } else
        res.status(404).send("Not found")
});

profilesRouter.get("/:username", async (req, res) => {
    const profile = await Profile.findOne({ username: req.params.username }).populate('experiences')
    if (profile) {
        res.send(profile);
    } else
        res.status(404).send("Not found")
});

profilesRouter.post("/:username",
 passport.authenticate('jwt', {session: false}),
  async (req, res) => {
    try {
        const obj = {
            ...req.body,
            username: req.params.username,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const profile = await Profile.create(obj);
        console.log(profile)
        await User.findOneAndUpdate({username: req.params.username}, {profile: profile._id})
        res.send(profile);
    } catch (exx) {
        res.status(500).send(exx);
    }
});

profilesRouter.put("/:id", passport.authenticate('jwt',  {session: false}), async (req, res) => {
    delete req.body._id;
    const profile = await Profile.findOneAndUpdate(
        { _id: req.params.id },
        {
            $set:
                { ...req.body }
        }).populate('experiences');
    if (profile)
        res.send(profile);
    else
        res.status(404).send("Not found ");
});

profilesRouter.delete("/:_id", passport.authenticate('jwt'), async (req, res) => {
    const result = await Profile.deleteOne({ _id: req.params._id });
    if (result)
        res.send(result);
    else
        res.status(404).send("not found");
});

profilesRouter.post("/:username/picture",
passport.authenticate('jwt'), 
upload.single("profile"), async (req, res) => {
    console.log('yo')
    try{
        if(req.user.username !== req.params.username) res.status(404).send('User not found')
        // const userProfile = await Profile.findOne({username: req.params.username})
        // if (userProfile.image !== "https://fooddole.com/Modules/eCommerce/images/default-img.png"){ 
        //     const container = await blob.getContainerClient("profile"); 
        //     console.log(container)
        //     const urlParts = userProfile.image.split("/")
        //     console.log(urlParts)
        //     const filename = urlParts.reverse()[0]
        //     console.log(filename)
        //     await container.deleteBlob(filename)
        // }
        const profile = await Profile.findOneAndUpdate({ username: req.params.username }, { image: req.file.url }, { new: true, useFindAndModify: false }).populate('experiences');
        res.send(profile)
    } catch (err) {
        res.send(err)
    }
});

profilesRouter.get("/:username/CV", async (req, res) => {
    try {
        const profile = await Profile.findOne({ username: req.params.username });
        if (profile) {
            await generatePDF(profile); // I'm calling a function that is returning a promise so I can await for that
            res.setHeader("Location", "/pdf/" + req.params.username + ".pdf");
            res.status(302).send("/pdf/" + req.params.username + ".pdf");
        } else {
            res.status(404).send("NOT FOUND");
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = profilesRouter;
