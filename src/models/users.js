const mongoose = require("mongoose") 

const usersSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: true
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
    }
},
{
    timestamps: true
})

const usersCollection = mongoose.model("user", usersSchema)

module.exports = usersCollection