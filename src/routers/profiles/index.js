const express = require("express");
const Profile = require("../../models/profiles");
const profilesRouter = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");

const readProfiles = async () => {
    return await Profile.find();
};
profilesRouter.get("/", async (req, res)=>{
    // if (req.query.name)
    //     return res.send(await Profile.find({ name: req.query.name}));
    const profiles = await Profile.find({});
    res.send(profiles);
});

profilesRouter.get("/me", async(req,res)=> {
    const profile = await Profile.findOne({username: req.user.username});
    if (profile) {

        res.send(profile);
    } else
        res.status(404).send("Not found")
});

profilesRouter.get("/:username", async(req,res)=> {

    const profile = await Profile.findOne({username: req.params.username});
    if (profile) {

        res.send(profile);
    } else
        res.status(404).send("Not found")
});

profilesRouter.post("/", async (req, res)=>{
    let profiles = await readProfiles();
    const s = profiles.find(profile => profile.name === req.body.name);
    if (s!==undefined) {
        res.status(400).send("INVALID NAME");
    } else {
        try {
            const newProfile = await Profile.create(req.body);
            newProfile.save();
            res.send(newProfile);
        } catch (exx) {
            res.status(500).send(exx);
        }
    }
});
profilesRouter.put("/:id", async (req, res)=>{

    delete req.body._id;

    const profile = await Profile.findOneAndUpdate(
        {_id: req.params.id},
        {
            $set:
                {...req.body}
        });
    if (profile)
        res.send(profile);
    else
        res.status(404).send("Not found " +req.params.id);
});
profilesRouter.delete("/:_id", async (req, res)=>{
    const result = await Profile.deleteOne({ _id: req.params._id});
    if (result)
        res.send(result);
    else
        res.status(404).send("not found");
});
const upload = multer({});
profilesRouter.post("/:username/picture", upload.single("profile"), async (req, res) => {
    console.log("Entering the picture upload");
    try {
        let imgDest = path.join(__dirname,"../../../image/", "image.jpg" );
        console.log("imgDest: ", imgDest, __dirname)
        const imgDestination = req.protocol + "://" + req.get("host") + "/image/profiles/" + req.params.username + req.file.originalname;
        console.log("imgDest: ", imgDest)
        console.log("imgDestination: ", imgDestination)
        await fs.writeFile(imgDest, req.file.buffer);
        console.log(imgDestination);
        const exp = await Profile.findOneAndUpdate({username: req.params.username}, {image: imgDestination}, {new: true, useFindAndModify: false});
        res.send(exp)
    } catch (err) {
        console.log(err);
        res.send(err)
    }
});
profilesRouter.get("/:username/CV", async (req, res) => {
    try {
        const profile = await Profile.findOne({username: req.params.username});
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