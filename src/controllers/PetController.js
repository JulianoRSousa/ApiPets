const Pet = require('../models/Pet');
const Auth = require('../models/Auth');

module.exports = {

    async getPetByUserId(req, res) {
        const { user } = req.headers;

        const pets = await Pet.find({ user: user });

        return res.json(pets);
    },

    async showallpets(req, res) {

        const pets = await Pet.find();

        return res.json(pets);
    },

    async store(req, res) {
        const { profilePicture } = req.file;
        const {
            firstName,
            lastName,
            color,
            coatSize,
            birthdate,
            male,
        } = req.body;
        const { user } = req.headers;


        const pet = await Pet.create({
            profilePicture: profilePicture,
            picture: null,
            status: "Neutro",
            firstName: firstName,
            lastName: lastName,
            color: color,
            coatSize: coatSize,
            birthdate: birthdate,
            male: male,
            user: user,
        })
        return res.json(pet);
    },

    async deletepet(req, res) {
        const { pet, token } = req.headers;
        const authenticated = await Auth.findOne({ _id: token });
        const petData = await Pet.deleteOne({ _id: pet, user: authenticated.user });
        if(petData.deletedCount != 0)
        return res.json(petData);
        return res.json({ 'error': 'Inappropriete User or Pet' });
    }
};