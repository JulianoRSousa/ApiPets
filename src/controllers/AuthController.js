const Auth = require('../models/Auth');
const User = require('../models/User');

//index, show, store, update, destroy

module.exports = {

    async confirmauth(req, res) {
        const { token } = req.headers;
        if (token == "000000000000000000000000" || token == null || token == '') {
            return res.status(403).json({ 'Error': 'Initial Mode' });
        } else {
            try {
                const authenticated = await Auth.findOne({ _id: token });
                if (authenticated) {
                    await authenticated.populate('user').execPopulate();
                    return res.status(200).json(authenticated);
                } else {
                    return res.status(200).json({ 'Error': 'Invalid Token' });
                }
            } catch (error) {
                return res.status(500).json({ 'Error': 'Invalid Token Format' });
            }
        }
    },


    async isOn(req, res) {
        return res.status(200).json({ 'Server Status': 'Online' });
    },


    async showAllSessions(req, res) {
        if (process.env.ENVIRONMENT == 'dev') {
            try {
                const auth = await Auth.find({ auth: true })
                .populate({ path: "user" })
                return res.json(auth);

            } catch (error) {
                console.log(error);
                return error;
            }
        }
        return res.status(403).json({ "error": "No system admin logged" });
    },


    async createauth(req, res) {

        const { username, pass } = req.headers;
        const user = await User.findOne({ username, pass });
        if (user) {
            try {
                await Auth.deleteMany({ user: user.id });
                const authenticated = await Auth.create({
                    user: user.id,
                    auth: true,
                });
                await authenticated.populate('user').execPopulate();
                return res.status(201).json(authenticated);
            } catch (error) {
                return res.status(500).json({ 'error': 'Unable to create new auth' });
            }
        }
        return res.status(401).json({ 'error': 'User or pass does not match' });
    },


    async deleteauth(req, res) {
        const { token } = req.headers;
        try {
            const auth = await Auth.deleteOne({ _id: token });
            if (auth.deletedCount)
                return res.status(201).json(auth);
            return res.status(401).json({ 'Error': 'No auth for this token' })
        } catch (error) {
            return res.status(500).json({ 'Internal Server Error': error.message });
        }
    },

    async deleteallauth(req, res) {
        if (process.env.ENVIRONMENT == 'dev') {
        try {
            await Auth.deleteMany();
        } catch (error) {
            return res.status(500).json({ 'Error': 'Error on delete' });
        }
        return res.json({ message: 'Deleted' });
    }
    return res.status(403).json({ "error": "No system admin logged" });
}
};