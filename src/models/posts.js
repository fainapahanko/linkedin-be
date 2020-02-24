const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    text: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    username: {
        type: String,
    },
    image:{
        type: String,
        required: false
    },
    likesTotal: {
        type: Number,
        default: 0
    },
    likes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        },
        username: {
            type: String
        }
    }],
    comments: [{
            type: Schema.Types.ObjectId,
            ref: "comment"
    }]
}, { timestamps: true});

const postsCollection = mongoose.model('post', postSchema);
module.exports = postsCollection;