const mongoose = require("mongoose") 
const passportLocalMongoose = require('passport-local-mongoose')

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true,
        unique:true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'profiles'
    },
    facebookId: {
        type: String,
        required:false
    }
},
{
    timestamps: true
});

usersSchema.plugin(passportLocalMongoose, {
    usernameField : "username"})

module.exports = mongoose.model("user", usersSchema)