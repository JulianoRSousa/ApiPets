const Post = require('../models/Post');
const Auth = require('../models/Auth');

module.exports = {

    async getPostByState(req, res) {
        const { state } = req.query;

        const post = await Post.find({ state: state });

        return res.json(post);
    },

    async getPostByUserId(req, res) {
        const { user_id } = req.query;

        const post = await Post.find({ user: user_id });

        return res.json(post);
    },

    async showAllPosts(req, res) {
        const posts = await Post.find({})
        return res.json(posts)
    },

    async store(req, res) {
        const { picture } = req.file.filename;
        const { state, description } = req.body;
        const { user_id, pet_id, token } = req.headers;

        const auth = await Auth.findOne({ _id: token })

        try {
            if (req.file) {
                if (auth) {
                    try {
                        var date = new Date();
                        const post = await Post.create({
                            picture: picture,
                            state,
                            description,
                            postDate: date.getDate() + '/' +
                                (date.getMonth() + 1) + '/' +
                                date.getFullYear(),
                            postTime: date.getHours() + ':' +
                                date.getMinutes(),
                            user: user_id,
                            pet: pet_id,
                        })
                        return res.json(post);

                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        } catch (error) {
            console.log("error.message = ", error.message,)
        }
    },

    async deletePost(req, res) {
        const { post_id, user_id, token } = req.headers;

        const post = await Post.deleteOne({
            _id: post_id
        });
        return res.json(post);
    }

};
