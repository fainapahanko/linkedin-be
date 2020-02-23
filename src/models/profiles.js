const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const profileSchema = new Schema({
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
            required: true
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
            required: false,
            default: "https://fooddole.com/Modules/eCommerce/images/default-img.png"
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            required: true
        },
        updatedAt: {
            type: Date,
            required: true
        },
        experiences: [
            {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'experience' 
            }
        ]
    },
    {timestamps: true});
const profileList = mongoose.model("profiles", profileSchema);

module.exports = profileList;
