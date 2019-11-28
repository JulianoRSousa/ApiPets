const Auth = require('../models/Auth');
const User = require('../models/User');


//index, show, store, update, destroy


module.exports = {

    async getUserByEmail(req, res) {
        const email = req.headers.email.toLowerCase();

        const user = await User.find({ email });

        return res.json(user);
    },

    async showallusers(req, res) {

        const users = await User.find();

        return res.json(users);
    },

    async getUserById(req, res) {
        const { user } = req.headers;

        const userData = await User.find({ _id: user });

        return res.json(userData);
    },


    async setProfilePicture(req, res) {
        const { profilePicture } = req.file;
        const { token } = req.headers;
        let user = null;
        await Auth.findOne({ token }).then(Response => {
            user = Response.data.user
        })

        if (user) {
            user = await User.create({
                profilePicture: profilePicture,
            });
            user = await User.updateOne({})
            return res.status(201).json(user);
        }

        return res.status(202).json({ 'Error': 'No changes done' })
    },

    async deleteUserByEmail(req, res) {
        const email = req.headers.email.toLowerCase();

        const deleted = await User.findOneAndDelete({ email })
        if (deleted == null)
            return res.status(202).json({ 'Error': 'This email was not found!' })
        return res.status(200).json(deleted)
    },


    // async editBorn(req, res){
    //     let data = [];
    //    data[0] = token = req.headers;
    //    data[1]  = born = req.headers.born;

    //     //  console.log("tosource",valueOf(data[0]))
    //      if(valueOf(data[1])){
    //          console.log("nao veio")
    //      }else{
    //          console.log("veio")
    //      }

    //  console.log(valueOf(data[1]))
    //  console.log(valueOf(data[2]))
    //  function filterByID(obj) {
    //     if (Object.values(obj) == Object.values(error) ) {
    //         console.log("false")
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   }
    //   var safeData = data.filter(filterByID)

    // console.log("safedata::>",safeData)

    // let edit = await Auth.findOne({ _id: token })

    //     if(edit.user == user){
    //         let result1 = await User.findOne({_id: user})
    //         let abc = await User.updateOne({_id: user},{ born: born})
    //         result1.save()
    //         return res.json(abc)
    //     }
    //     return res.json({'Error': 'Data do not match!'})
    // },


    async createLogin(req, res) {
        const { email, pass, fullname, male  } = req.headers;

        console.log(req.headers);

        const getuser = await User.findOne({ email: email.toLowerCase() });
        try {
            if (!getuser) {
                let user = await User.create({
                    email: email.toLowerCase(),
                    pass,
                    firstName: fullname.split(" ")[0],
                    lastName: fullname.split(" ").slice(1).join(' '),
                    male,
                    profilePicture: "InitialProfile.png"
                });
    
    
    
                const auth = await Auth.create({
                    user: user._id,
                    auth: true,
                });
    
                await auth.populate('user').execPopulate();
    
                return res.status(201).json(auth);
            }
            return res.status(202).json({ 'Error': 'This email is already registered!' })
        } catch (error) {
            console.log(error.message);
        }
        
        
        
    }
};