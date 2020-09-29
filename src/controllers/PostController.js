const Post = require('../models/Post');
const Auth = require('../models/Auth');

module.exports = {

    async getPostByState(req, res) {
        const { state } = req.headers;
        try {
            const post = await Post.find({ state: state });
            return res.status(200).json(post);
        } catch (error) {
            return res.status(500).json({'Error':'Cant Find PostState'});
        }
    },

    async getPostByUserId(req, res) {
        const { user_id } = req.headers;
        try {
            const post = await Post.find({ user: user_id });
            return res.status(200).json(post);
        } catch (error) {
            return res.status(500).json({ 'Error': 'Invalid User Format' });
        }
    },

    async showAllPosts(req, res) {
        if (process.env.ENVIRONMENT == "dev") {
            try {
                const posts = await Post.find()
                return res.status(200).json(posts)
            } catch (error) {
                return res.status(500).json({ 'Error': 'Cant find posts' });
            }
        }
        return res.status(403).json({ "error": "No system admin logged" });
    },

    async createPost(req, res) {
        const { picture } = req.file;
        const { state, description } = req.body;
        const { user_id, pet_id, token } = req.headers;

        const auth = await Auth.findOne({ _id: token })

        try {
            if (req.file) {
                if (auth) {
                    try {
                        var date = new Date();
                        const post = await Post.create({
                            picture: '',
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
        const { post, token } = req.headers;
        try {
            const authenticated = await Auth.findOne({ _id: token });
            if (authenticated.auth) {
                const postData = await Post.deleteOne({ _id: post, user: authenticated.user });
                if (postData.deletedCount)
                    return res.status(201).json(postData);
                return res.status(401).json({ 'error': 'Inappropriete Pet' });
            }
            return res.status(401).json({ 'error': 'Inappropriete User or Pet' });
        } catch (error) {
            return res.status(500).json({ 'error': 'Invalid token parameters' });
        }
    },

};
