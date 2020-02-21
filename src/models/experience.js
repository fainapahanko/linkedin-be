const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
    role: { 
        type: String,
        required: true
    },
    company: { 
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required:true
    },
    endDate: {
        type: Date,
        required:false
    },
    description: { 
        type: String,
        required: true
    },
    area:{ 
        type: String,
        required: true
    },
    username:{ 
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "http://www.gigabitmagazine.com/sites/default/files/styles/slider_detail/public/topic/image/GettyImages-1017193718_1.jpg?itok=W4-tjXij"
    }
})

const experienceCollection = mongoose.model("experience", experienceSchema)

module.exports = experienceCollection