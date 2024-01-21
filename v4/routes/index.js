var express = require('express');
var router = express.Router();
const userModel =require("./users");
const postModel =require("./post"); 
const bodyParser = require('body-parser');


const passport = require('passport');
const upload =require("./multer")


const localStratergy =require('passport-local');
passport.use(new localStratergy(userModel.authenticate()));
router.use(bodyParser.urlencoded({ extended: true }));


router.get('/', function(req, res, next) {
  res.render('index',{nav:false});
});
router.get('/edit', isLoggedIn, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const user = await userModel.findOne({ _id: loggedInUser._id });
    if (!user) {
      // Handle the case where the user is not found
      return res.status(404).send('User not found');
    }

    // Render the edit.ejs template and pass the user object
    res.render('edit', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
router.post('/edit', isLoggedIn, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const updateResult = await userModel.updateOne({ _id: loggedInUser._id }, req.body);

    if (updateResult.nModified === 0) {
      // Handle the case where no documents were modified (user not found or no changes)
      return res.status(404).send('No changes made or user not found');
    }

    // Redirect to the edit page or another page as needed
    res.redirect('/edit');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/login', function(req, res, next) {
  res.render('login',{nav:false});
});
router.get('/login2', function(req, res, next) {
  res.render('login2',{nav:false});
});
router.get("/reg_or_log",function(req,res){
  res.render("reg_or_log");
})
router.get("/reg_or_log2",function(req,res){
  res.render("reg_or_log2");
})


router.get('/add',isLoggedIn, async function(req, res, next) {
  const user =await userModel.findOne({username: req.session.passport.user})
  res.render('add',{nav:true});
});

router.post('/createpost', isLoggedIn, upload.single("postimage"), async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  const post = await postModel.create({
    user: user._id,
    title: req.body.title,
    Description: req.body.Description,
    image: req.file.filename,
    price: req.body.price,
    discount: req.body.discount
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile1");
});

router.get('/register', function(req, res, next) {
  res.render("register",{nav:false});
});
router.get('/register2', function(req, res, next) {
  res.render("register2",{nav:false});
});

router.get('/profile',isLoggedIn,async function(req, res, next) {
  const user =await userModel.findOne({username: req.session.passport.user})
.populate("posts")
  res.render("profile",{user, nav : true});
});

router.get('/show/posts',isLoggedIn,async function(req, res, next) {
  const user =await userModel.findOne({username: req.session.passport.user})
.populate("posts")
  res.render("show",{user, nav : true});
});

router.get('/feed',isLoggedIn,async function(req, res, next) {
  const user =await userModel.findOne({username: req.session.passport.user})
 const posts = await postModel.find()
.populate("user")
res.render("feed",{user, posts,nav:true})
});

router.get('/details/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await postModel.findById(postId).populate('user');
    res.render('details', { post });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/fileupload', isLoggedIn, upload.single("image"), async function(req, res, next){
const user =await userModel.findOne({username: req.session.passport.user})
user.ProfileImage= req.file.filename;
await user.save();
res.redirect("./profile1");

});
router.post('/register', async function (req, res, next) {
  try {
    const salt = await userModel.generateSalt();

    const hash = await userModel.hashPassword(req.body.password, salt);

    const data = new userModel({
      username: req.body.username,
      email: req.body.email,
      name: req.body.fullname,
      salt: salt,
      hash: hash,
      dateOfBirth: req.body.dob,
      age: req.body.age,
      mobile: req.body.contact,
      city: req.body.city
    });

    await userModel.register(data, req.body.password);
    passport.authenticate("local")(req, res, function () {
      res.redirect('/profile1');
    });
  } catch (err) {
    console.log(err);
    res.redirect('/register');
  }
});

// router.post('/register2', function(req, res, next) {
//   const data = new userModel({
//       username: req.body.username,
//       email: req.body.email,
//       name: req.body.fullname,
//       password: req.body.password,
//       dateOfBirth: req.body.dob,
//       age: req.body.age,
//       mobile: req.body.contact,
//       city: req.body.city
//   });

//   userModel.register(data, req.body.password)
//       .then(function(registeredUser) {
//           passport.authenticate("local")(req, res, function() {
//               res.redirect('/profile2');
//           });
//       })
//       .catch(function(err) {
//           console.log(err);
//           res.redirect('/register2');
//       });
// });
router.post('/register2', async function (req, res, next) {
  try {
    const salt = await userModel.generateSalt();

    const hash = await userModel.hashPassword(req.body.password, salt);

    const data = new userModel({
      username: req.body.username,
      email: req.body.email,
      name: req.body.fullname,
      salt: salt,
      hash: hash,
      dateOfBirth: req.body.dob,
      age: req.body.age,
      mobile: req.body.contact,
      city: req.body.city
    });

    await userModel.register(data, req.body.password);
    passport.authenticate("local")(req, res, function () {
      res.redirect('/profile2');
    });
  } catch (err) {
    console.log(err);
    res.redirect('/register2');
  }
});

router.post('/login', passport.authenticate("local",{
successRedirect :"/profile1",
failureRedirect: "/login"
}),function(req, res){}
);
router.post('/login2', passport.authenticate("local",{
  successRedirect :"/profile2",
  failureRedirect: "/login2"
  }),function(req, res){}
  );

router.get("/logout",function(req,res,next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/',{nav:false});
    });
  
})


function isLoggedIn(req,res,next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

// notification
const http = require('http');

const server = http.createServer(router);

const socketIO = require('socket.io');
const io = socketIO(server);

router.use(bodyParser.urlencoded({ extended: true }));

// Sample data to simulate seller and customer profiles
let sellerNotifications = [];
let customerNotifications = [];

// Seller profile route
router.get('/profile1',isLoggedIn,async function(req, res, next) {
  const user =await userModel.findOne({username: req.session.passport.user})
.populate("posts")
  res.render("profile1",{user, nav : true});
});

// Customer profile route
router.get('/profile2',isLoggedIn,async function(req, res, next) {
  const user =await userModel.findOne({username: req.session.passport.user})
.populate("posts")
const posts = await postModel.find().populate("user")
 res.render("profile2",{user,posts, nav : true});
});
router.get('/feed',isLoggedIn,async function(req, res, next) {
  const user =await userModel.findOne({username: req.session.passport.user})
 const posts = await postModel.find()
.populate("user")
res.render("feed",{user, posts,nav:true})
});


// WebSocket connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for customer notifications
    socket.on('notify-seller', (message) => {
        console.log('Notification from customer to seller:', message);
        sellerNotifications.push(message);
        io.emit('update-seller-notifications', sellerNotifications);
    });

    // Listen for seller notifications
    socket.on('notify-customer', (message) => {
        console.log('Notification from seller to customer:', message);
        customerNotifications.push(message);
        io.emit('update-customer-notifications', customerNotifications);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});


module.exports = router;


