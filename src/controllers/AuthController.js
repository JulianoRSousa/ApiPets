const Auth = require('../models/Auth');
const User = require('../models/User');

//index, show, store, update, destroy

module.exports = {

    async confirmauth(req, res) {
        const { token } = req.headers;
        console.log("Token Lenght = ",token.lenght)
        if (token == "000000000000000000000000" || token == null || token == "") {
            return res.json({ 'error': 'Code 0s' });
        } else {
            try {
                const authenticated = await Auth.findOne({ _id: token });
                if (authenticated._id == token) {
                    await authenticated.populate('user').execPopulate();
                    return res.status(200).json(authenticated);
                }else{

                }
            } catch (error) {
                console.log(error);            
                return res.json({ 'error': error });
            }
        }
    },


    async gettrue(req, res) {
        return res.json({ auth: true });
    },


    async showSession(req, res) {
        try {
            const auth = await Auth.find({ auth: true });
            return res.json(auth);

        } catch (error) {
            console.log(error);
            return error;
        }
    },


    async createauth(req, res) {

        const { email, pass } = req.headers;

        let user = await User.findOne({ email, pass });

        if (user != null) {

            await Auth.deleteMany({ user: user._id });

            const authenticated = await Auth.create({
                user: user._id,
                auth: true,
            });
            await authenticated.populate('user').execPopulate();
            return res.status(201).json(authenticated);
        }
        return res.status(401).json({ 'error': 'Autenticação não encontrada' });
    },


    async deleteauth(req, res) {
        const { token } = req.headers;

        const auth = await Auth.deleteOne({
            _id: token
        });
        return res.json(auth);
    },

    async deleteallauth(req, res) {

        try {
            await Auth.deleteOne();
            await Auth.deleteOne();
            await Auth.deleteOne();
            await Auth.deleteOne();
            await Auth.deleteOne();
            await Auth.deleteOne();
            await Auth.deleteOne();
            await Auth.deleteOne();
            await Auth.deleteOne();
            await Auth.deleteOne();
            await Auth.deleteOne();
            await Auth.deleteOne();
            await Auth.deleteOne();

        } catch (error) {

        }


        return res.json({ message: 'Deleted' });
    }
};