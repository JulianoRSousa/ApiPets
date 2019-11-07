const mongoose =  require('mongoose');

const UserSchema = new mongoose.Schema({
    profilePicture: String,
    pictures: String,
    email: String,
    pass: String,
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
    return `https://back-apipets.herokuapp.com/files/${this.profilePicture}`
})

module.exports = mongoose.model('User', UserSchema);