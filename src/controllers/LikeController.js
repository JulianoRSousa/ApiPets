const Like = require('../models/Like');
const Auth = require('../models/Auth');
const Post = require('../models/Post');

module.exports = {

    async getLikeByPostId(req, res) {
        const { post_id } = req.headers;
        try {
            const post = await Post.findOne({ _id: post_id })
            if (post) {
                const like = await Like.find({ post_id: post_id });
                return res.status(200).json(like);
            }
            return res.status(404).json({ 'Error': 'Invalid Post' })
        } catch (error) {
            return res.status(500).json({ 'Error': 'Invalid Token format' })
        }

    },

    async getLikeCount(req, res) {
        const { post_id } = req.headers;

        try {
            const post = await Post.findOne({ _id: post_id })
            if (post) {
                const like = await Like.countDocuments({ post_id: post_id });
                return res.status(200).json(like);
            }
            return res.status(404).json({ 'Error': 'Invalid Post' })
        } catch (error) {
            return res.status(500).json({ 'Error': 'Invalid Token format' })
        }

    },

    async createLike(req, res) {
        try {
            const { post_id, token } = req.headers;

            const authenticated = await Auth.findOne({ _id: token });
            if (authenticated.auth) {
                const liked = await Like.findOne({ post_id: post_id, liker: authenticated.user });
                if (liked) {
                    try {
                        const like = await Like.deleteOne({
                            post_id: post_id, liker: authenticated.user
                        });
                        return res.status(202).json(like);
                    } catch (error) {
                        return res.status(401).json({ 'Error': 'Invalid Like' })
                    }
                } else {
                    const like = await Like.create({
                        post_id: post_id,
                        liker: authenticated.user,
                    })
                    return res.status(200).json(like);
                }
            }
        } catch (error) {
            return res.status(500).json({ 'Error': 'Invalid token format' })
        }
    },

    async showAllLikes(req, res) {

        const like = await Like.find();

        return res.json(like);
    },
};