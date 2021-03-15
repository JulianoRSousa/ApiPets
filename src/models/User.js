const mongoose =  require('mongoose');

const UserSchema = new mongoose.Schema({
    picture: String,
    pictures: String,
    username: String,
    pass: String,
    petsCount: String,
    firstName: String,
    lastName: String,
    born: String,
    location: String,
    foneNumber: String,
    male: Boolean,
}, {
    toJSON: {
        virtuals: true,
    },
});

UserSchema.virtual('picture_url').get(function() {
    return process.env.PETS_URL+this.picture;
})

module.exports = mongoose.model('User', UserSchema);