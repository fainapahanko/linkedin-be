const express = require("express");
const Profile = require("../../models/profiles");
const Exp = require('../../models/experience')
const User = require('../../models/users')
const profilesRouter = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const passport = require('passport')

profilesRouter.get("/", async (req, res)=>{
    if (req.query.name)
         return res.send(await Profile.find({ name: req.query.name}));
    const profiles = await Profile.find({});
    res.send(profiles);
});

profilesRouter.get("/me", passport.authenticate('jwt',  {session: false}), async (req, res) => {
    console.log(req.user)
    const profile = await Profile.findOne({username: req.user.username});
    const experience = await Exp.find({username: req.user.username})
    if (profile) {
        res.send({profile : profile, experience: experience});
    } else
        res.status(404).send("Not found")
});

profilesRouter.get("/:username", async (req, res) => {
    const profile = await Profile.findOne({ username: req.params.username });
    const experience = await Exp.find({username: req.params.username})
    if (profile) {
        res.send({profile: profile, experience: experience});
    } else
        res.status(404).send("Not found")
});

const upload = multer({});
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
        });
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

profilesRouter.post("/:username/picture",passport.authenticate('jwt'), upload.single("profile"), async (req, res) => {
    try {
        let imgDest = path.join(__dirname, "../../../image/", req.params.username + req.file.originalname);
        const imgDestination = req.protocol + "://" + req.get("host") + "/image/" + req.params.username + req.file.originalname;
        await fs.writeFile(imgDest, req.file.buffer);
        const exp = await Profile.findOneAndUpdate({ username: req.params.username }, { image: imgDestination }, { new: true, useFindAndModify: false });
        res.send(exp)
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
