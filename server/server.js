require("dotenv").config({ path: __dirname + ".env" });
var session = require("express-session");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
const joi = require("joi"); // schema validation

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();
const cors = require("cors");
const server = require("http").createServer(app);
const fs = require("fs");
//for future automatic refreshing
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

// for the images
const multer = require("multer");
const upload = multer();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT || 8080;

const corsOptions = cors({
  origin: [
    "bccompsciconnect-server-4w7ddycrna-uc.a.run.app",
    "http://localhost:4200",
  ],
  // allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

app.use(corsOptions);
app.options("*", corsOptions);

app.use(cookieParser("secret"));

app.use(
  session({
    cookie: { maxAge: 1000 * 60 * 60 },
    name: "session",
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    httpOnly: false,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'static')));

// internal modules
const db = require("./models/db");
const helpers = require("./helpers");

////////////////////////////
/*  Google AUTH  */
/* 
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send("Unauthorized Authentication");
  }

  try {
    const decoded = jwt.verify(token, "secret_string");
    req.user = decoded;
    console.log("User making request: ");
    console.log(req.user);
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:8080/api/google/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       userProfile = profile;
//       return done(null, userProfile);
//     }
//   )
// );
app.get(
  "/api/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/api/google/error", (req, res) => {
  res.send({ status: "failure" });
});

app.get(
  "/api/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google/error" }),
  async (req, res) => {
    // Successful authentication
    console.log(userProfile);
    //load session parameters from payload
    req.session.user = { username: userProfile.displayName };
    req.session.username = userProfile.displayName;

    //TODO: handle how it interacts with user database

    req.session.loggedIn = true;
    req.session.save();
    res.send({ status: "success" });
  }
);

//USING THE GENERATED BUTTON
app.post("/api/google/", async (req, res) => {
  const payload = req.body;
  req.session.user = { username: payload.email };
  req.session.loggedIn = true;
  req.session.save();

  //add user to database somehow
});

////////////////////////////
*/
//Sockets
io.on("connection", (socket) => {
  console.log("a user connected");
  //send client updates
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.post("/api/register", async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;

  await db.helpers.addUser(name, email, password, "user");
});

app.get('/api/login', async (req, res) => {
  req.session.user ? res.status(200).send({loggedIn: true, user: req.session.user.username, role: req.session.user.role}) : res.status(200).send({loggedIn: false});
})

app.post("/api/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  const targetUser = await db.helpers.getUser(email);
  if(targetUser.length === 0)
  {
    console.log('Account not found')
    res.send({"status": "failed"})
  }
  else if(email === targetUser[0].email && password === targetUser[0].password)
  {
    req.session.user = {username: targetUser[0].username, email: email, password: password, role: targetUser[0].role}
    console.log(req.session.id)
    req.session.loggedIn = true;
    req.session.save();
    const token = jwt.sign({email: email, password: password}, "secret_string", {expiresIn:"1h"});
    res.cookie('jwt', token, {httpOnly:true, secure:false})
    res.json({ status: "success", token: token, role: targetUser[0].role });
  }
});

//For some reason it isnt working / Not calling but the clear cookie works.
app.post("/api/logout", async (req, res) => {
  console.log(req.session.user);
  if (req.session.user) {
    req.session.destroy();
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: false,
    });
    res.send({ status: "loggedout" });
  }
});

app.get("/api/logout", async (req, res) => {
  console.log(req.session.user);
  if (req.session.user) {
    req.session.destroy();
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: false,
    });
    res.send({ status: "loggedout" });
  }
});

app.get("/api/usercheck", async (req, res) => {
  let name = req.query.name;
  let exists = false;
  const user = await db.helpers.getUserByUsername(name);
  console.log("User length:" + user.length);
  if (user.length !== 0) {
    exists = true;
  }
  res.json({
    exists: exists,
  });
});

// USERS //

app.get("/api/user/:username", async (req, res) => {
  let username = req.params.username;
  const user = await db.helpers.getUserByUsername(username);
  res.json(user);
});

app.put("/api/user/:username", async (req, res) => {
  let oldUsername = req.params.username;
  let newUsername = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let description = req.body.description;

app.put('/api/edituser/', async (req, res) => {
  let username = req.body.username
  let role = req.body.role
  let id = req.body.id
  const user = await db.helpers.editUserById(id, username, role);
})

app.get('/api/users', isLoggedIn, async (req, res) => {
  const users = await db.helpers.getUsers();
  res.json(users)
})

app.post('/api/delete', async (req, res) => {
  try {
    let id = req.body.id;
    await db.helpers.deleteUser(id);
    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal Server Error"); 
  }
});

// BOARDS //

app.get("/api/boards", isLoggedIn, async (req, res) => {
  const boards = await db.helpers.getBoards();
  console.log(req.session.user);
  res.json(boards);
});

app.get("/api/board", async (req, res) => {
  const boards = await db.helpers.getBoards();
  res.json(boards);
});

// Either id based params (the easy way) or hard coded board topics into url (e.g. /java or /algorithms, etc)
app.get("/api/board/:id", async (req, res) => {
  try {
    let id = req.params.id;

    // i.e. /board/:id/?page=<number>
    let page = req.query.page;
    let offset = 0;
    let range = 100;

    //if there is a page number query grab associated topics
    if (Object.keys(req.query).length !== 0) {
      offset = (page - 1) * 10;
      range = page * 10;
    }

    const board = await db.helpers.getBoard(id);
    const topics = await db.helpers.getTopicsByRange(id, offset, range);
    res.json({
      board: board,
      topics: topics,
    });
  } catch (err) {
    console.log("Redirect or 404 here");
  }
});

app.get("/api/board/:id/latest", async (req, res) => {
  try {
    let id = req.params.id;
    let range = 10;
    let offset = 0;

    const board = await db.helpers.getBoard(id);
    const topics = await db.helpers.getTopicsByRange(id, offset, range);
    res.json({
      board: board,
      topics: topics,
    });
  } catch (err) {
    console.log("Redirect or 404 here");
  }
});

app.post("/api/board", async (req, res) => {
  let boardTitle = req.body.boardTitle;
  let boardDescription = req.body.boardDescription;
  let ordering = req.body.ordering;
  const board = await db.helpers.addBoard(
    boardTitle,
    boardDescription,
    ordering
  );
});

app.put("/api/board/:boardId", async (req, res) => {
  let boardId = req.params.boardId;
  let boardTitle = req.body.boardTitle;
  let boardDescription = req.body.boardDescription;
  let ordering = req.body.ordering;
  await db.helpers.editBoard(boardId, boardTitle, boardDescription, ordering);
  res.redirect(303, "/api/boards");
});

app.delete("/api/board/:boardId", async (req, res) => {
  let boardId = req.params.boardId;
  const deletedBoard = await db.helpers.deleteBoard(boardId);
  res.redirect(303, "/api/boards/");
});

// TOPICS AND POSTS //

// TODO: are these still needed
app.post("/api/board/:boardId", async (req, res) => {
  let boardId = req.params.boardId;
  let question = req.body.question;
  await db.helpers.addTopic(boardId, question, null);
  res.redirect(`/api/board/${boardId}`);
});

// TODO: are these still needed
app.post("/api/board/:boardId/latest", async (req, res) => {
  let boardId = req.params.boardId;
  let question = req.body.question;
  await db.helpers.addTopic(boardId, question, null);
  res.redirect(`/api/board/${boardId}`);
});

app.get("/api/board/:boardId/topic/:topicId", async (req, res) => {
  let boardId = req.params.boardId;
  let topicId = req.params.topicId;
  const topic = await db.helpers.getTopic(topicId);
  const posts = await db.helpers.getPosts(topicId);
  const postCount = await db.helpers.getPostCount(topicId);

  //Subject to change; this just bundles the topic and associated Posts together
  res.json({
    topic: topic,
    posts: posts,
    postCount: postCount.rows[0].count,
  });
});

app.delete("/api/board/:boardId/topic/:topicId", async (req, res) => {
  let boardId = req.params.boardId;
  let topicId = req.params.topicId;
  await db.helpers.deleteTopic(topicId);
  res.redirect(302, `/api/board/${boardId}`);
});

const postPostSchema = joi.object({
  created_by: joi.number().integer().required(),
  text: joi.string().required(),
});

app.post("/api/board/:boardId/topic/:topicId", async (req, res) => {
  let boardId = req.params.boardId;
  let topicId = req.params.topicId;
  let body = req.body;
  let valid = postPostSchema.validate(body);
  if (valid.error == null) {
    await db.helpers.addPost(topicId, text, body.created_by);
    res.redirect(302, `/api/board/${boardId}/topic/${topicId}`);
  } else {
    res.status(400).json({ error: { code: 400, message: "invalid schema" } });
  }
});

//CHANGING THESE ENDPOINTS LATER IF NEEDED
app.delete("/api/board/:boardId/topic/:topicId/delete", async (req, res) => {
  let boardId = req.params.boardId;
  let topicId = req.params.topicId;
  let postId = req.body.postId;
  await db.helpers.deletePost(postId);
  res.redirect(302, `/api/board/${boardId}/topic/${topicId}`);
});

app.put("/api/board/:boardId/topic/:topicId/edit", async (req, res) => {
  let boardId = req.params.boardId;
  let topicId = req.params.topicId;

  let postId = req.body.postId;
  let postText = req.body.text;
  postText = helpers.sanitizePost(postText);

  await db.helpers.editPost(postId, postText);
  res.redirect(302, `/api/board/${boardId}/topic/${topicId}`);
});

//NOLAN NEW
app.get("/api/board/:boardId", async (req, res) => {
  let boardId = req.params.boardId;
  const topics = await db.helpers.getTopic(boardId);
  res.json(topics);
});

const postTopicAndFirstPostSchema = joi.object({
  boardid: joi.number().integer().required(),
  question: joi.string().required(), // ie the title
  created_by: joi.number().integer().required(),
  body: joi.string().required(), // of the first post of the topic
});

app.post("/api/board/addtopic", async (req, res) => {
  let valid = postTopicAndFirstPostSchema.validate(req.body);
  if (valid.error == null) {
    let body = req.body;
    await db.helpers.addTopic(
      body.boardid,
      body.question,
      body.created_by,
      body.body
    );
    res.json({ message: "success" });
  } else {
    res.status(400).json({ error: { code: 400, message: "invalid schema" } });
  }
});

// Getting images

app.get("/api/images", async (req, res) => {
  try {
    const images = await db.helpers.getImages();
    res.json(images);
  } catch (err) {
    console.error("Failed to fetch images:", err);
    res.status(500).send("Failed to fetch images");
  }
});
// for uploadding images

app.post("/api/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No files were uploaded.");
  }

  // Example: Extract additional information from the request
  // NOTE: Ensure these values are validated and sanitized properly in a real app
  const { postid, userid, url } = req.body;
  const filename = req.file.originalname; // Use the original file name or generate a new one
  const imageBuffer = req.file.buffer; // Image data as a buffer

  try {
    // Call saveImage with the required parameters
    const savedImage = await db.helpers.saveImage(
      filename,
      imageBuffer,
      url,
      postid,
      userid
    );
    res.json({ message: "Image uploaded successfully", image: savedImage });
  } catch (err) {
    console.error("Failed to upload image:", err);
    res.status(500).send("Failed to upload image.");
  }
});

// getting an image by user id

app.get("/api/images/user/:userid", async (req, res) => {
  const { userid } = req.params;

  // Optional: Validate userid if needed
  if (!userid || isNaN(Number(userid))) {
    return res.status(400).send("Invalid user ID.");
  }

  try {
    const images = await db.helpers.getImagesByUserId(userid);
    if (images.length === 0) {
      return res.status(404).send("No images found for this user.");
    }
    res.json(images);
  } catch (err) {
    console.error("Failed to fetch images for user:", err);
    res.status(500).send("Failed to fetch images.");
  }
});

// app.get("*", (req, res) =>{
//   res.sendFile(path.join(__dirname, "static/index.html"));
// });

//TODO: Socket connection

function isLoggedIn(req, res, next) {
  if (req.session.user) {
    //permit the user the resource
    console.log("Logged in.");
    next();
  } else {
    //Otherwise send response to frontend; todo
    console.log("Not logged in.");
    next();
  }
}

// Initialize the database
async function InitDB() {
  await db.helpers.init();
  console.log("Successfully init db");
}

InitDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
