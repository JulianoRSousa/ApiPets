const Like = require('../models/Like');

module.exports = {

    async getLikeByPostId(req, res) {
        const { post_id } = req.headers;

        const like = await Like.find({ post_id: post_id});

        return res.json(like);
    },

    async getLikeCount(req, res) {
        const { post_id } = req.headers;

        const like = await Like.find({ post_id: post_id});

        return res.json(like.length);
    },

    async store(req, res) {
        const { liker, post_id } = req.headers;

        
        const like = await Like.create({
            post_id: post_id,
            liker: liker,
        })

        return res.json(like);
    },

    async deletelike(req, res){
        const { like_id } = req.headers;

            const like = await Like.deleteOne({
                _id: like_id
            });
        return res.json(like);
    }
};