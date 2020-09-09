const Like = require('../models/Like');
const Auth = require('../models/Auth');

module.exports = {

    async getLikeByPostId(req, res) {
        const { post_id } = req.headers;

        const like = await Like.find({ post_id: post_id });

        return res.json(like);
    },

    async getLikeCount(req, res) {
        const { post_id } = req.headers;

        const like = await Like.countDocuments({ post_id: post_id });

        return res.json(like);
    },

    async store(req, res) {
        const { post_id, token } = req.headers;

        try {
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
                        return res.status(401).json({'Error':'Invalid Like'})
                    }
                } else {
                    const like = await Like.create({
                        post_id: post_id,
                        liker: authenticated.user,
                    })
                    return res.json(like);
                }
            }
        } catch (error) {
            return res.status(401).json({'Error': 'Invalid token'})
        }
    },

    async deletelike(req, res) {
        const { post_id, user } = req.headers;
        console.log(post_id+"abcd")
        console.log(user)
        try {
            const like = await Like.deleteOne({
                post_id: post_id, liker: user
            });
            return res.json(like);
        } catch (error) {
            return res.status(401).json({'Error':'Invalid Like'})
        }
        
    },

    async showAllLikes(req, res) {

        const like = await Like.find();

        return res.json(like);
    },
};