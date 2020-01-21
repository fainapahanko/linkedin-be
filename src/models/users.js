const mongoose = require("mongoose") 

const usersSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: true,
        unique: true
    },
    password: {
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
    profile: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'profile'
    },
    experience: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'experience'
    }]
},
{
    timestamps: true
})

const usersCollection = mongoose.model("user", usersSchema)

module.exports = usersCollection