const mongoose =  require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    message: String,
    caller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    registerDate: String,
    reason: String,
});

module.exports = mongoose.model('Complaint', ComplaintSchema);