require("dotenv").config({ path: __dirname + ".env" });
var session = require("express-session");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
const joi = require("joi"); // schema validation
const { v4: uuidv4 } = require("uuid");

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
//app.use(express.static(path.join(__dirname, 'static')));

// internal modules
const db = require("./models/db");
const helpers = require("./helpers");


////////////////////////////
/*  Google AUTH  */

//USING THE GENERATED BUTTON
app.post("/api/google/", async (req, res) => {
  const payload = req.body;
  let possibleUser = await db.helpers.getUser(payload.email);

  //add user to database if email doesn't exist, otherwise login with existing credentials
  if (possibleUser.length === 0) {
    await db.helpers.addUser(
      payload.email,
      payload.email,
      `${payload.sub}`, //google account unique id acts as placeholder for hashify
      "user",
      payload.sub
    );
    
    possibleUser = await db.helpers.getUser(payload.email);
    req.session.user = {
      id: possibleUser[0].id,
      username: possibleUser[0].username,
      email: possibleUser[0].email,
      role: possibleUser[0].role,
    };
    req.session.loggedIn = true;
    req.session.save();


  } else {
    req.session.user = {
      id: possibleUser[0].id,
      username: possibleUser[0].username,
      email: possibleUser[0].email,
      role: possibleUser[0].role,
    };
    req.session.loggedIn = true;
    req.session.save();
  }
});

// middleware to send a 401 error if the user is not logged in
const requireLogin = (req, res, next) => {
  if (req.session.user == null || req.session.user.id == null) {
    return res.status(401).json({ code: 401, error: "Must be logged in" });
  }
  next();
};

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

  //user is creating account using site
  await db.helpers.addUser(name, email, password, "user", null);
});

app.get("/api/login", async (req, res) => {
  req.session.user
    ? res.status(200).send({
        loggedIn: true,
        id: req.session.user.id,
        user: req.session.user.username,
        role: req.session.user.role,
      })
    : res.status(200).send({ loggedIn: false });
});

app.post("/api/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  const targetUser = await db.helpers.getUser(email);

  if (targetUser.length === 0) {
    console.log("Account not found");
    res.send({ status: "failed" });
  } else if (
    email === targetUser[0].email &&
    db.helpers.checkPassword(targetUser[0].password, password)
  ) {
    req.session.user = {
      id: targetUser[0].id,
      username: targetUser[0].username,
      email: email,
      password: password,
      role: targetUser[0].role,
    };
    console.log(req.session.id);
    req.session.loggedIn = true;
    req.session.save();
    const token = jwt.sign(
      { email: email, password: password },
      "secret_string",
      { expiresIn: "1h" }
    );
    res.cookie("jwt", token, { httpOnly: true, secure: false });
    res.json({ status: "success", token: token, role: targetUser[0].role });
  }
});

app.post("/api/logout", async (req, res) => {
  console.log(req.session.user);
  if (req.session.user) {
    req.session.destroy();
    res.clearCookie("jwt", {
      httpOnly: false,
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
      httpOnly: false,
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

app.get("/api/checkemail/:email", async (req,res)=> {
  let email = req.params.email;
  let exists = false;
  const user = await db.helpers.getUserByEmail(email);
  console.log("User length:" + user.length);
  if (user.length !== 0) {
    exists = true;
  }
  res.json({
    exists: exists,
  });
})

// USERS //

app.get("/api/user/:username", async (req, res) => {
  let username = req.params.username;
  const user = await db.helpers.getUserByUsername(username);
  res.json(user);
});

app.put("/api/user/:username/editprofile", async (req, res) => {
  let oldUsername = req.params.username;
  let newUsername = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let description = req.body.description;
  await db.helpers.editUserProfile(
    newUsername,
    email,
    password,
    description,
    oldUsername
  );
  req.session.user.username = newUsername;
  req.session.save();
});

app.put("/api/edituser/", async (req, res) => {
  let username = req.body.username;
  let role = req.body.role;
  let id = req.body.id;
  const user = await db.helpers.editUserById(id, username, role);
});

app.get("/api/users", isLoggedIn, async (req, res) => {
  const users = await db.helpers.getUsers();
  res.json(users);
});

app.post("/api/delete", async (req, res) => {
  try {
    let id = req.body.id;
    await db.helpers.deleteUser(id);
    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal Server Error");
  }
});

//profile pictures; experimental
app.post("/api/uploadprofile", upload.single("image"), async (req, res) => {
  //alert(req.file.mimetype); // Log the MIME type
  if (!req.file) {
    return res.status(400).send("No files were uploaded.");
  }

  await db.helpers.saveProfilePicture(
    req.file.buffer,
    req.body.username,
    req.file.mimetype
  );
});

app.get("/api/getprofile/:username", async (req, res) => {
  const image = await db.helpers.getProfilePicture(req.params.username)
  res.json(image)
})

// BOARDS //

app.get("/api/boards", isLoggedIn, async (req, res) => {
  if (req.session.user) {
    console.log(req.session.user.username);
  }

  const boards = await db.helpers.getBoards();
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

app.post("/api/board/pin", async (req, res) => {
  let id = req.body.id;
  let tf = req.body.tf;
  console.log("Updating: " + id + " from " + tf);
  if(tf == "false") {
    await db.helpers.pinBoard(id, "true");
  } else {
    await db.helpers.pinBoard(id, "false");
  }
});

app.post("/api/board/delete", async (req, res) => {
  let id = req.body.id;
  await db.helpers.deleteBoard(id);
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

app.post("/api/add/board", async (req, res) => {
  let boardTitle = req.body.boardTitle;
  let boardDescription = req.body.boardDescription;
  const board = await db.helpers.addBoard1(
    boardTitle,
    boardDescription
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

app.get("/api/board/:boardId/topic/:topicId", async (req, res) => {
  let boardId = req.params.boardId;
  let topicId = req.params.topicId;
  const board = await db.helpers.getBoard(boardId)
  const topic = await db.helpers.getTopic(topicId);
  const posts = await db.helpers.getPosts(topicId);
  const postCount = await db.helpers.getPostCount(topicId);
  await db.helpers.addViewToTopic(topicId);
  console.log(posts)
  //Subject to change; this just bundles the topic and associated Posts together
  res.json({
    board: board,
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

app.post("/api/topic/delete", async (req,res) => {
    let topicId =  req.body.id;
    await db.helpers.deleteTopic(topicId);
})

const postPostSchema = joi.object({
  text: joi.string().required(),
});

app.post(
  "/api/board/:boardId/topic/:topicId/add-post",
  requireLogin,
  async (req, res) => {
    let boardId = req.params.boardId;
    let topicId = req.params.topicId;
    let body = req.body;
    let valid = postPostSchema.validate(body);
    if (valid.error != null) {
      res.status(400).json({ error: { code: 400, message: "invalid schema" } });
    }
    await db.helpers.addPost(topicId, body.text, req.session.user.id);
    res.redirect(302, `/api/board/${boardId}/topic/${topicId}`);
  }
);

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
  question: joi.string().required(), // ie the title
  body: joi.string().required(), // of the first post of the topic
});

app.post("/api/board/:boardId/add-topic", requireLogin, async (req, res) => {
  let valid = postTopicAndFirstPostSchema.validate(req.body);
  if (valid.error != null) {
    res.status(400).json({ error: { code: 400, message: "invalid schema" } });
  }
  let body = req.body;
  let boardId = req.params.boardId;
  let topicId = await db.helpers.addTopic(
    boardId,
    body.question,
    req.session.user.id,
    body.body
  );
  res.json({ 'topicId': topicId });
});

app.get("/api/posts/:userID", async (req, res) => {
  let userID = req.params.userID
  const posts = await db.helpers.getPostsByUser(userID)
  res.json(posts);
})

app.get("/api/board/:boardId/topic/:topicId/post/:postId", async (req, res) => {
  let params = req.params
  let post = await db.helpers.getPost(params.postId)
  if(post.length < 1) {
    res.status(404).json({ error: { code: 404, message: "no post with given id found" }})
    return
  }
  res.json(post[0])
})

const editPostSchema = joi.object({
  text: joi.string().required(),
});

app.put("/api/board/:boardId/topic/:topicId/post/:postId", async (req, res) => {
  let valid = editPostSchema.validate(req.body)
  if(valid.error != null) {
    res.status(400).json({ error: { code: 400, message: "invalid schema" } });
  }

  let post = await db.helpers.editPost(req.params.postId, req.body.text)
  res.json({ message: "success"})
})

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

  // Extracting additional information from the request
  const { username, postid, userid, url } = req.body;
  const filename = req.file.originalname; // The original file name
  const imageBuffer = req.file.buffer; // Image data as a buffer
  const contentType = req.file.mimetype; // Extracting the content type of the uploaded file

  try {
    // Assuming saveImage function is modified to accept contentType parameter
    const savedImage = await db.helpers.saveImage(
      username,
      filename,
      imageBuffer,
      url,
      postid,
      userid,
      contentType // Pass the content type to your database/helper function
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
    const image = await db.helpers.getImagesByUserId(userid);
    console.log(image);
    if (!image) {
      return res.status(404).send("Image not found");
    }

    const contentType = image.content_type || "image/jpeg"; // Adjust based on your schema
    res.type(contentType);

    // Send the image data
    res.send(image.image); //
  } catch (err) {
    console.error("Failed to fetch images for user:", err);
    res.status(500).send("Failed to fetch images.");
  }
});

// get userimage
app.get("/api/userimages/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Assuming you have a function to get the image by ID
    const user = await db.helpers.getuserImage(username);

    if (!user || !user.profile_image) {
      return res.status(404).send("Image not found");
    }

    const image_type = user.image_type || "image/jpeg"; // Adjust based on your schema
    res.type(image_type);
    console.log(`Serving image for ${username}: type ${image_type}`);
    // Send the image data
    res.send(user.profile_image); // Assuming 'image.image' is the binary data
  } catch (err) {
    console.error("Error fetching image:", err);
    res.status(500).send("Failed to fetch image");
  }
});

//  get image by id

app.get("/api/images/:imageId", async (req, res) => {
  const { imageId } = req.params;

  try {
    // Assuming you have a function to get the image by ID
    const image = await db.helpers.getImageById(imageId);

    if (!image) {
      return res.status(404).send("Image not found");
    }

    const contentType = image.content_type || "image/jpeg"; // Adjust based on your schema
    res.type(contentType);

    // Send the image data
    res.send(image.image); // Assuming 'image.image' is the binary data
  } catch (err) {
    console.error("Error fetching image:", err);
    res.status(500).send("Failed to fetch image");
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
