const mongoose =  require('mongoose');

const LikeSchema = new mongoose.Schema({
    liker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
});

module.exports = mongoose.model('Like', LikeSchema);