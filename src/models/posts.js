const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var postSchema = new Schema({
    text: {
        type: String,
        required: [true, "Type in a comment!"],
        minlength: 3,
        maxlength: 50
    },
    username: {
        type: String,
    },
    image:{
        type: String,
        default: 'http://via.placeholder.com/640x360'
    }
}, { timestamps: true});

const postsCollection = mongoose.model('Post', postSchema);
module.exports = postsCollection;