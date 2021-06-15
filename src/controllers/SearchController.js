const Auth = require('../models/Auth');
const User = require('../models/User');

//index, show, store, update, destroy

module.exports = {

    async searchFriends(req, res, next) {
        const { tags } = req.headers;
            try {
                // const resultSearch1 = await User.find({"tags": { $all: tags[0],tags[1] }}).pretty()
                const resultSearch2 = await User.find({"tags": { $in: tags }})
                    // await resultSearch2.populate('user').execPopulate();
                    return res.status(200).json(resultSearch2);
            } catch (error) {
                console.log(error)
                return res.status(500).json({ 'Error': 'Internal Server Error' });
            }
        
    }
    
};