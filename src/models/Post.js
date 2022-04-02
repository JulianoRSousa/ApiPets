const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    description: String,
    dataVersion: {
        type: Number,
        default: 0
    },
    picture: {
        type: String,
        default: 'NoPicturePost.jpg'
    },
    pictureList: [
        {
            type: mongoose.Schema.Types.String,
            default: 'NoPicturePost.jpg'
        }
    ],
    status: {
        type: String,
        default: '0',
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }
}, {
    id: false,
    toJSON: {
        virtuals: true,
        versionKey: true,
        useProjection: true,
        transform: function (doc, ret) {
            ret.dataVersion = ret.__v, delete ret.__v
        }
    },
});

PostSchema.virtual('pictureUrl').get(function () {
    return process.env.PETS_URL + this.picture;
});

module.exports = mongoose.model('Post', PostSchema);