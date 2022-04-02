const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    message: String,
    commenter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    editedAt: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('Comment', CommentSchema);