const mongoose =  require('mongoose');

const PostSchema = new mongoose.Schema({
    picture: String,
    status: String,
    description: String,
    postDate: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }
}, {
    toJSON: {
        virtuals: true,
    },
});

PostSchema.virtual('picture_url').get(function() {
    return `http://localhost:3333/files/${this.picture}`
})

module.exports = mongoose.model('Post', PostSchema);