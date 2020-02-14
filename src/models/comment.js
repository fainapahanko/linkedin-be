const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment: {
        type: String,
        required : true
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
},{timestamps: true});

const commentList = mongoose.model("comment", commentSchema);

module.exports = commentList;