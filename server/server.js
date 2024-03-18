var createError = require('http-errors');
var session = require('express-session')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');


var app = express();
const cors = require('cors')
const server = require('http').createServer(app)
const fs = require("fs");
//for future automatic refreshing
const { Server } = require("socket.io")
const io = new Server(server)
const port = process.env.PORT || 8080;


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public'), { index: ['index.html'] }));
//app.use(express.static('../frontend/dist'))

// internal modules
const db = require('./models/db')
app.use(cors());

//user session
app.use(session({
  name: 'usersession',
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  maxAge: 1000*60*60
}))

//prevent view engine complaints
app.set('view engine', 'jade');

app.get('/', async (req, res) => {
  const boards = await db.helpers.getBoards();
  res.json(boards)
})


app.post('/register', async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;

  //if user exists in database, stop
  const user = await db.helpers.getUser(name, email);
  if(user.length !== 0) {
    console.log("user already exists")
  }
  //elseadd user to database
  console.log(name)

})


// BOARDS //

app.get('/board', async (req, res) => {
  const boards = await db.helpers.getBoards();
  res.json(boards)
})

// Either id based params (the easy way) or hard coded board topics into url (e.g. /java or /algorithms, etc)
app.get('/board/:id', async(req, res) => {
  try {
    let id = req.params.id

    // i.e. /board/:id/?page=<number>
    let page = req.query.page
    let offset = 0;
    let range = 100;

    //if there is a page number query grab associated topics
    if(Object.keys(req.query).length !== 0) {
      console.log('there is a query')
      offset = (page - 1) * 10;
      range = page * 10;
    }
    
    const board = await db.helpers.getBoard(id)
    const topics = await db.helpers.getTopicsByRange(id, offset, range);
    res.json({
      board: board,
      topics: topics
    })
  } catch (err) {
    console.log("Redirect or 404 here")
  }
  
})

//could probably attach query string for further page calls
app.get('/board/:id/latest', async(req, res) => {
  try {
    let id = req.params.id;
    let range = 10;
    let offset = 0;

    const board = await db.helpers.getBoard(id)
    const topics = await db.helpers.getTopicsByRange(id, offset, range);
    res.json({
      board: board,
      topics: topics
    })
  } catch (err) {
    console.log("Redirect or 404 here")
  }
})


app.post('/board', async (req, res) => {
  let boardTitle = req.body.boardTitle;
  const board = await db.helpers.addBoard(boardTitle);
  res.redirect(303, '/board')
})

app.put('/board/:boardId', async (req, res) => {
  let boardId = req.params.boardId;
  let boardTitle = req.body.boardTitle;
  await db.helpers.editBoard(boardId, boardTitle)
  res.redirect(303, '/board')
})

app.delete('/board/:boardId', async (req, res) => {
  let boardId = req.params.boardId;
  const deletedBoard = await db.helpers.deleteBoard(boardId);
  res.redirect(303, '/board');
})

// TOPICS AND POSTS //

app.post('/board/:boardId', async (req, res) => {
  let boardId = req.params.boardId;
  let question = req.body.question
  await db.helpers.addTopic(boardId, question);
  res.redirect(`/board/${boardId}`)
})

app.post('/board/:boardId/latest', async (req, res) => {
  let boardId = req.params.boardId;
  let question = req.body.question
  await db.helpers.addTopic(boardId, question);
  res.redirect(`/board/${boardId}`)
})


app.get('/board/:boardId/topic/:topicId', async (req, res) => {
  let boardId = req.params.boardId;
  let topicId = req.params.topicId;
  const topic = await db.helpers.getTopic(topicId);
  const posts = await db.helpers.getPosts(topicId);
  const postCount = await db.helpers.getPostCount(topicId);

  //Subject to change; this just bundles the topic and associated Posts together
  res.json({
    topic: topic,
    posts: posts,
    postCount: postCount.rows[0].count
  })
})

app.delete('/board/:boardId/topic/:topicId', async (req, res) => {
  let boardId = req.params.boardId;
  let topicId = req.params.topicId
  await db.helpers.deleteTopic(topicId)
  res.redirect(302, `/board/${boardId}`)
})

app.post('/board/:boardId/topic/:topicId', async(req, res) => {
  let boardId = req.params.boardId;
  let topicId = req.params.topicId
  let text = req.body.text
  await db.helpers.addPost(topicId, text)
  res.redirect(302, `/board/${boardId}/topic/${topicId}`);
})

//CHANGING THESE ENDPOINTS LATER IF NEEDED
app.delete('/board/:boardId/topic/:topicId/delete', async(req, res) => {
  let boardId = req.params.boardId;
  let topicId = req.params.topicId
  let postId = req.body.postId;
  await db.helpers.deletePost(postId);
  res.redirect(302, `/board/${boardId}/topic/${topicId}`);
})

app.put('/board/:boardId/topic/:topicId/edit', async(req, res) => {
  let boardId = req.params.boardId;
  let topicId = req.params.topicId

  let postId = req.body.postId;
  let postText = req.body.text;

  await db.helpers.editPost(postId, postText)
  res.redirect(302, `/board/${boardId}/topic/${topicId}`);
})


//TODO: Socket connection

// Initialize the database
async function InitDB() {
  await db.helpers.init()
  console.log("Successfully init db")
}

InitDB().then(() => {
  app.listen(port);
  console.log(`Listening on port ${port}`)
})
.catch((err) => { console.log(err)})




module.exports = app;
