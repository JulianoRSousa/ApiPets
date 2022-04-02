const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({

    fullname: String,
    color: String,
    coat: String,
    birthdate: String,
    isMale: String,
    size: String,
    breed: String,
    dataVersion: Number,
    picture: {
        type: String,
        default: "InitialPetProfile.jpg"
    },
    type: {
        type: String,
        default: 'dog'
    },
    status: {
        type: String,
        default: '0',
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    pictureList: [{
        type: String,
        default: "InitialPetProfile.jpg"
    }],
    userTutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    id: false,
    toJSON: {
        virtuals: true,
        versionKey: true,
        useProjection: true,
        transform: function (doc, ret) {
            ret.petDataVersion = ret.__v, delete ret.__v
        }
    },
});

PetSchema.virtual('pictureUrl').get(function () {
    return process.env.PETS_URL + this.picture;
})

module.exports = mongoose.model('Pet', PetSchema);