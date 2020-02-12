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
    }
},
{
    timestamps: true
});

usersSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("user", usersSchema)