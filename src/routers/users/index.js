const express = require("express");
const router = express.Router();
const passport = require('passport');
const { getToken } = require('../../utils/auth')
const User = require("../../models/users");

const isAuthenticated = (req, res, next) => {
    passport.authenticate('local', { session: false })(req, res, next)
};

router.get("/", async(req,res) => {
    try{
        const experience = await User.find({});
        res.status(200).send(experience)
    } catch(err){
        res.send(err)
    }
});

router.get("/:id", async(req,res) => {
    try{
        const experience = await User.findOne({_id: req.params.id});
        res.status(200).send(experience)
    } catch(err) {
        res.status(500).send(err)
    }
});

router.post("/signup", async(req,res) => {
    try{
        const user = await User.register(req.body, req.body.password)
        const token = getToken({_id: user._id})
        res.status(200).send({
            token: token,
            user: user
        })
    }catch(err) {
        res.status(500).send(err)
    }
});

router.post('/signin',
isAuthenticated,
  (req,res) => {
    try{
        const token = getToken({_id: req.user._id})
        res.status(200).send({
            token: token,
            user: req.user
        })
    } catch(err) {
        res.send(err)
    }
})

router.post('/refresh', passport.authenticate('jwt'), async(req,res) => {
    const token = getToken({ _id: req.user._id })
    res.send({
        token: token,
        user: req.user
    })
})

router.post('/update-password', passport.authenticate('local'), async(req,res) => {
    try{
        const user = await User.findById(req.user._id)
        if(user) {
            await user.setPassword(req.body.newPassword)
            user.save()
            res.send(user)
        } else res.status(404).send("User not found")
    } catch(err) {
        res.send(err)
    }
})

router.delete("/:id", async(req, res) => {
    try{
        const user = await User.findOneAndRemove({_id: req.params.id})
        if(user) res.send("Ok");
        else  res.status(404).send("Not found")
    } catch(err){
        res.send(err)
    }
})

module.exports = router