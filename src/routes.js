const express = require("express");
const multer = require("multer");

const uploadConfig = require("./config/upload");
const UserController = require("./controllers/UserController");
const PetController = require("./controllers/PetController");
const PostController = require("./controllers/PostController");
const CommentController = require("./controllers/CommentController");
const LikeController = require("./controllers/LikeController");
const AuthController = require("./controllers/AuthController");
const ComplaintController = require("./controllers/ComplaintController");
const ImageController = require("./controllers/ImageController");
const FollowController = require("./controllers/FollowController");
const SearchController = require("./controllers/SearchController");
const DataController = require("./controllers/DataController");



const TestController = require("./controllers/TestController");

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


//IMAGE routes
routes.post(
  "/createimage",
  upload.single("image"),
  ImageController.createImage
); //OK//
routes.get("/getimagebykey", ImageController.getImageByKey); //OK//
routes.get("/showallimages", ImageController.showAllImages); //OK//
routes.delete("/deleteimagebykey", ImageController.deleteImageByKey); //OK//

//SEARCH routes
routes.get("/searchFriends", SearchController.searchFriends); //OK//

//DATA routes
routes.get("/getData", DataController.getData);

//USER routes
routes.post(
  "/setprofile",
  upload.single("profilePicture"),
  UserController.setProfilePicture
); //OK//
routes.post("/createuser", UserController.createUser); //OK//
routes.get("/getuserbyusername", UserController.getUserByUsername); //OK//
routes.get("/getuserbyemail", UserController.getUserByEmail); //OK//
routes.get("/showallusers", UserController.showallusers); //OK//
routes.get("/getuserbyid", UserController.getUserById); //OK//
routes.delete("/deleteuserbyuserid", UserController.deleteUserByUserId); //OK//
routes.delete("/deleteuserbytoken", UserController.deleteUserByToken); //OK//

//PETS routes
routes.post(
  "/createpet",
  upload.single("profilePicture"),
  PetController.createPet
); //OK//
routes.get("/getpetbyuserid", PetController.getPetByUserId); //OK//
routes.get("/showallpets", PetController.showallpets); //OK//
routes.get("/getpetbytoken", PetController.getPetByToken); //OK//
routes.delete("/deletepet", PetController.deletepet); //OK//
//routes.delete('/deleteallpets', PetController.deleteallpets);

//UserPOST routes
routes.post("/createpost", upload.single("picture"), PostController.createPost); //OK//
routes.get("/getpostbystate", PostController.getPostByState); //OK//
routes.get("/getpostbytoken", PostController.getPostByToken); //OK//
routes.get("/showallposts", PostController.showAllPosts); //OK//
routes.get("/getfeed", PostController.getFeed); //OK//
routes.get("/getmainfeed", PostController.getMainFeed); //OK//
routes.get("/getpage", PostController.getPage); //OK//
routes.delete("/deletepost", PostController.deletePost); //OK//
routes.delete("/UserDeletePosts", PostController.UserDeletePosts);

//COMMENT routes
routes.post("/createcomment", CommentController.createComment); //OK//
routes.get("/getcommentbypostid", CommentController.getCommentByPostId); //OK//
routes.get("/showallcomments", CommentController.showAllComments); //OK//
routes.delete("/deletecomment", CommentController.deleteComment); //OK//

//LIKE routes
routes.post("/createlike", LikeController.createLike); //OK//
routes.get("/getlikebypost", LikeController.getLikeByPostId); //OK//
routes.get("/getpostlikecount", LikeController.getLikeCount); //OK//
routes.get("/showalllikes", LikeController.showAllLikes); //OK//

//COMPLAINT routes
routes.post("/createcomplaint", ComplaintController.createComplaint); //OK//
routes.get("/getcomplaintbypost", ComplaintController.getComplaintByPostId); //OK//
routes.get("/showallcomplaint", ComplaintController.showAllComplaint); //OK//

//AUTH routes
routes.post("/createauth", AuthController.createauth); //OK//
routes.get("/loaduser", AuthController.loadUser); //OK//
routes.get("/confirmauth", AuthController.confirmauth); //OK//
routes.get("/showsessions", AuthController.showAllSessions); //OK//
routes.get("/ison", AuthController.isOn); //OK//
routes.delete("/deleteauth", AuthController.deleteauth); //OK//
routes.delete("/deleteallauth", AuthController.deleteallauth); //OK//

//FOLLOW routes
routes.post("/followfunction", FollowController.followFunction);
routes.get("/getfollowerbytoken", FollowController.getFollowerByToken);
routes.get("/getfollowerbyuserid", FollowController.getFollowerByUserId);
routes.get("/getfollowingbytoken", FollowController.getFollowingByToken);
routes.get("/getfollowingbyuserid", FollowController.getFollowingByUserId);

routes.post("/test", TestController.TestConsole)

module.exports = routes;
