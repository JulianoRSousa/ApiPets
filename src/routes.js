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



//FUNCTION NEED REMOVING {}

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
//  };

//USER routes
routes.put('/setprofile', upload.single('profilePicture'), UserController.setProfilePicture); //Untested route
routes.post('/createlogin', UserController.createLogin); //ok - UserProfile picture not working 
routes.get('/getuserbyemail', UserController.getUserByEmail); //ok
routes.get('/showallusers', UserController.showallusers); //ok
routes.get('/getuserbyid', UserController.getUserById); //ok
routes.delete('/deleteuserbyemail', UserController.deleteUserByEmail); //ok
routes.delete('/deleteuserbyid', UserController.deleteUserById); //ok

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
routes.post('/createcomment', CommentController.store); //ok
routes.get('/getcommentbypostid', CommentController.getCommentByPostId); //OK//
routes.get('/showallcomments', CommentController.showAllComments); //OK//
routes.delete('/deletecomment', CommentController.deleteComment); //OK//

//LIKE routes
routes.post('/createlike', LikeController.store);
routes.get('/getlikebypost', LikeController.getLikeByPostId);
routes.get('/getpostlikecount', LikeController.getLikeCount);
routes.delete('/deletelike', LikeController.deletelike);

//COMPLAINT routes
routes.post('/createcomplaint', ComplaintController.store);
routes.get('/getcomplaintbypost', ComplaintController.getComplaintByPostId);
routes.get('/showallcomplaint', ComplaintController.showAllComplaint);

//AUTH routes
routes.post('/createauth', AuthController.createauth);
routes.get('/confirmauth', AuthController.confirmauth);
routes.get('/showsessions', AuthController.showSession);
routes.get('/gettrue', AuthController.gettrue);
routes.delete('/deleteauth', AuthController.deleteauth);
routes.delete('/deleteallauth', AuthController.deleteallauth);


module.exports = routes;
