// const Auth = require('../models/Auth');
// const User = require('../models/User');

// //index, show, store, update, destroy

// module.exports = {

//     async searchFriends(req, res) {
//         const { tags } = req.headers;
//         if (token == null || token == '') {
//             return res.status(403).json({ 'Error': 'Initial Mode' });
//         } else {
//             try {
//                 const authenticated = await Auth.findOne({ _id: token });
//                 if (authenticated) {
//                     await authenticated.populate('user').execPopulate();
//                     return res.status(200).json(authenticated);
//                 } else {
//                     return res.status(200).json({ 'Error': 'Invalid Token' });
//                 }
//             } catch (error) {
//                 return res.status(500).json({ 'Error': 'Invalid Token Format' });
//             }
//         }
//     },



//     async tagUserOnSearch(req, res) {
//         const { tags } = req.headers;
//         if (token == null || token == '') {
//             return res.status(403).json({ 'Error': 'Initial Mode' });
//         } else {
//             try {
//                 const authenticated = await Auth.findOne({ _id: token });
//                 if (authenticated) {
//                     await authenticated.populate('user').execPopulate();
//                     return res.status(200).json(authenticated);
//                 } else {
//                     return res.status(200).json({ 'Error': 'Invalid Token' });
//                 }
//             } catch (error) {
//                 return res.status(500).json({ 'Error': 'Invalid Token Format' });
//             }
//         }
//     }
// };