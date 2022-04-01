const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    postId: String,
    postDescription: String,
    postDataVersion: {
        type: Number,
        default: 0
    },
    postPicture: {
        type: String,
        default: 'NoPicturePost.jpg'
    },
    postPictureList: [
        {
            type: mongoose.Schema.Types.String,
            default: 'NoPicturePost.jpg'
        }
    ],
    postStatus: {
        type: String,
        default: '0',
    },
    postCreatedAt: {
        type: Date,
        default: Date.now()
    },
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
        virtuals: true,
        versionKey: true,
        useProjection: true,
        transform: function (doc, ret) {
            ret.postId = ret._id,
                ret.postDataVersion = ret.__v, delete ret.__v
        }
    },
});

PostSchema.virtual('postPictureUrl').get(function () {
    return process.env.PETS_URL + this.postPicture;
});

module.exports = mongoose.model('Post', PostSchema);