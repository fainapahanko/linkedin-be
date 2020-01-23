const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const profileSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            // validate(value) {
            //     if (!validator.isEmail(value)) {
            //         throw new Error("Email is invalid!");
            //     }
            // }
        },
        bio: {
            type: String,
            required: false
        },
        title: {
            type: String,
            required: false
        },
        area: {
            type: String,
            required: false
        },
        image: {
            type: String,
            required: false
        },
        username: {
            type: String,
            required: true
        }
    },
    {timestamps: true});
const profileList = mongoose.model("profiles", profileSchema);

module.exports = profileList;