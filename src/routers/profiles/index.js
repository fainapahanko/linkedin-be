const express = require("express");
const Profile = require("../../models/profiles");
const profilesRouter = express.Router();

const readProfiles = async () => {
    return await Profile.find();
};
profilesRouter.get("/", async (req, res)=>{
    if (req.query.name)
        return res.send(await Profile.find({ name: req.query.name}));
    const profiles = await Profile.find({});
    res.send(profiles);
});
profilesRouter.get("/:_id", async(req,res)=> {

    const profile = await Profile.findOne({_id: req.params._id});
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
module.exports = profilesRouter;