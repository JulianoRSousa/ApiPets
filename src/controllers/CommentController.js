const Comment = require('../models/Comment');

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


    async store(req, res) {
        const { message, commenter, post_id } = req.headers;
        var date = new Date();

        const comment = await Comment.create({
            commenter: commenter,
            post_id: post_id,
            message: message,
            registerDate:
                date.getHours() + ':' + date.getMinutes() + " - " +
                date.getDate() + '/' +
                (date.getMonth() + 1) + '/' +
                date.getFullYear(),
        })

        return res.status(202).json(comment);
    },


    async deleteComment(req, res) {
        const { comment_id, token } = req.headers;
        try {
            const authenticated = await Auth.findOne({ _id: token });
            if (authenticated != null) {
                const commentData = await Comment.deleteOne({ _id: comment_id, commenter: authenticated.user });
                if (commentData.deletedCount != 0)
                    return res.json(commentData);
                return res.json({ 'error': 'Inappropriete Comment' });
            }
            return res.json({ 'error': 'Inappropriete User or Comment' });
        } catch (error) {
            return res.json({ 'error': 'Invalid token parameters' });
        }

    },
};