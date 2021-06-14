const mongoose =  require('mongoose');

const UserSchema = new mongoose.Schema({
    picture: String,
    pictures: String,
    email: String,
    username: String,
    pass: String,
    postsCount: String,
    petsCount: String,
    firstName: String,
    lastName: String,
    birthDare: String,
    location: String,
    foneNumber: String,
}, {
    toJSON: {
        virtuals: true,
    },
});

UserSchema.virtual('picture_url').get(function() {
    return process.env.PETS_URL+this.picture;
})

module.exports = mongoose.model('User', UserSchema);