const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    message: String,
    reason: String,
    caller: {
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
});

module.exports = mongoose.model('Complaint', ComplaintSchema);