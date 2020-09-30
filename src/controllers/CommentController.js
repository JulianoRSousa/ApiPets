const Comment = require('../models/Comment');
const Auth = require('../models/Auth');

module.exports = {


    async getCommentByPostId(req, res) {
        const { post_id } = req.headers;

        const comments = await Comment.find({ post_id: post_id });

        return res.json(comments);
    },

    async showAllComments(req, res) {

        const comments = await Comment.find();

        return res.json(comments);
    },


    async createComment(req, res) {

        try {
            const { message, post_id, token } = req.headers;

            var date = new Date();
            const authenticated = await Auth.findOne({ _id: token })
            if (authenticated.auth) {
                const comment = await Comment.create({
                    commenter: authenticated.user,
                    post_id: post_id,
                    message: message,
                    registerDate:
                        date.getHours() + ':' + date.getMinutes() + " - " +
                        date.getDate() + '/' +
                        (date.getMonth() + 1) + '/' +
                        date.getFullYear(),
                })
                return res.status(201).json(comment);
            }
        } catch (error) {
            return res.status(401).json({ 'Error': 'Invalid token' });
        }
    },


    async deleteComment(req, res) {
        const { comment, token } = req.headers;
        try {
            const authenticated = await Auth.findOne({ _id: token });
            if (authenticated.auth) {
                const commentData = await Comment.deleteOne({ _id: comment, commenter: authenticated.user });
                if (commentData.deletedCount != 0)
                    return res.status(201).json(commentData);
                return res.status(200).json({ 'error': 'Inappropriete Comment' });
            }
            return res.status(403).json({ 'error': 'Inappropriete Comment or Commenter' });
        } catch (error) {
            return res.status(401).json({ 'error': 'Invalid token parameters' });
        }
    },
};