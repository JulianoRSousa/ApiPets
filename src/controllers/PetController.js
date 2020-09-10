const Pet = require('../models/Pet');
const Auth = require('../models/Auth');

module.exports = {

    async getPetByUserId(req, res) {
        const { user_id } = req.headers;

        try {
            const pets = await Pet.find({ user: user_id });
            return res.status(200).json(pets);
        } catch (error) {
            return res.status(500).json({ "Error": "Invalid User Format" });
        }
    },

    async showallpets(req, res) {
        if (process.env.ENVIRONMENT == 'dev') {
            try {
                const pets = await Pet.find();
                return res.status(200).json(pets);
            } catch (error) {
                return res.status(403).json({ 'Error': 'Cant Find Pets' });
            }
        }
        return res.status(403).json({ "Error": "No system admin logged" });
    },

    async store(req, res) {
        const { profilePicture } = req.file.filename;
        const {
            firstName,
            lastName,
            color,
            coatSize,
            birthdate,
            male,
        } = req.body;
        const { token } = req.headers;

        try {
            const authenticated = await Auth.findOne({ _id: token });
            if (authenticated) {
                const pet = await Pet.create({
                    profilePicture: profilePicture,
                    pictures: "",
                    status: "Neutral",
                    firstName: firstName,
                    lastName: lastName,
                    color: color,
                    coatSize: coatSize,
                    birthdate: birthdate,
                    male: male,
                    user: authenticated.user,
                })
                return res.status(201).json(pet);
            }
            return res.status(401).json({ 'Error': 'Invalid Token' });
        } catch (error) {
            return res.status(500).json({ 'Error': 'Invalid Token Format' });
        }



    },

    async deletepet(req, res) {
        const { pet, token } = req.headers;
        try {
            const authenticated = await Auth.findOne({ _id: token });
            if (authenticated) {
                const petData = await Pet.deleteOne({ _id: pet, user: authenticated.user });
                if (petData.deletedCount)
                    return res.status(201).json(petData);
                return res.status(404).json({ 'error': 'Inappropriete Pet' });
            }
            return res.status(401).json({ 'error': 'Inappropriete User or Pet' });
        } catch (error) {
            return res.status(500).json({ 'error': 'Invalid token parameters' });
        }
    },

    /*
    async deleteallpets(req, res) {

        try {
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
            await Pet.deleteOne();
        } catch (error) {
        }
        return res.json({ message: 'Deleted' });
    }
*/

};