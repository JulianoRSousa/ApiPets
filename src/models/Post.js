const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    postIde: String,
    postPicture: String,
    postState: String,
    postDescription: String,
    postCreatedAt: {
        type: Date,
        default: Date.now
    },
    postDataVersion: Number,
    postUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    postPet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }
}, {
    toJSON: {
        virtuals: false,
        versionKey: true,
        useProjection: true,
        transform: function (doc, ret) {
            ret.postId = ret._id, delete ret._id,
                ret.postDataVersion = ret.__v, delete ret.__v
        }
    },
});

PostSchema.virtual('picture_url').get(function () {
    return process.env.PETS_URL + this.postPicture;
});

module.exports = mongoose.model('Post', PostSchema);