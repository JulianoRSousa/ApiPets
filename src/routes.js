const express =  require('express');
const multer = require('multer');

const uploadConfig = require('./config/upload')
const UserController = require('./controllers/UserController');
const PetController = require('./controllers/PetController');
const PostController = require('./controllers/PostController');
const CommentController = require('./controllers/CommentController');
const LikeController = require('./controllers/LikeController');
const AuthController = require('./controllers/AuthController');
const ComplaintController = require('./controllers/ComplaintController');


const routes = express.Router();
const upload = multer(uploadConfig);



//FUNCTION NEED REMOVING {

//showallusers;
//getuserbyid;
//deleteuserbyemail;

//showallpets
//deleteallpets

//showallposts;
//showallcomments;

//showsessions;
//gettrue;
//deleteallauth;
//  }

//USER routes
routes.put('/setprofile', upload.single('profilePicture'), UserController.setProfilePicture); //Untested route
routes.post('/createlogin', UserController.createLogin); //ok - UserProfile picture not working 
routes.get('/getuserbyemail', UserController.getUserByEmail); //OK//
routes.get('/showallusers', UserController.showallusers); //OK//
routes.get('/getuserbyid', UserController.getUserById); //OK//
routes.delete('/deleteuserbyid', UserController.deleteUserById); //OK//

//PETS routes
routes.post('/createpet', upload.single('profilePicture'), PetController.store); //ok - Need fix the pet profile picture
routes.get('/getpetbyuserid', PetController.getPetByUserId); //OK//
routes.get('/showallpets', PetController.showallpets); //OK//
routes.delete('/deletepet', PetController.deletepet); //OK//
//routes.delete('/deleteallpets', PetController.deleteallpets);

//UserPOST routes
routes.post('/createpost', upload.single('picture'), PostController.store); //ok - Need fix the post profile picture
routes.get('/getpostbystate', PostController.getPostByState); //OK//
routes.get('/getpostbyuserid', PostController.getPostByUserId); //OK//
routes.get('/showallposts', PostController.showAllPosts); //OK//
routes.delete('/deletepost', PostController.deletePost); //OK//

//COMMENT routes
routes.post('/createcomment', CommentController.store); //OK//
routes.get('/getcommentbypostid', CommentController.getCommentByPostId); //OK//
routes.get('/showallcomments', CommentController.showAllComments); //OK//
routes.delete('/deletecomment', CommentController.deleteComment); //OK//

//LIKE routes
routes.post('/createlike', LikeController.store); //OK//
routes.get('/getlikebypost', LikeController.getLikeByPostId); //OK//
routes.get('/getpostlikecount', LikeController.getLikeCount); //OK//
routes.get('/showalllikes', LikeController.showAllLikes); //OK//

//COMPLAINT routes
routes.post('/createcomplaint', ComplaintController.store); //OK//
routes.get('/getcomplaintbypost', ComplaintController.getComplaintByPostId); //OK//
routes.get('/showallcomplaint', ComplaintController.showAllComplaint); //OK//

//AUTH routes
routes.post('/createauth', AuthController.createauth); //OK//
routes.get('/confirmauth', AuthController.confirmauth); //OK//
routes.get('/showsessions', AuthController.showSession); //OK//
routes.get('/ison', AuthController.isOn); //OK//
routes.delete('/deleteauth', AuthController.deleteauth); //OK//
routes.delete('/deleteallauth', AuthController.deleteallauth); //OK//


module.exports = routes;
