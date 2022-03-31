const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    commenter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    message: String,
    registerDate: String,
});

module.exports = mongoose.model('Comment', CommentSchema);