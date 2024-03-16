var createError = require('http-errors');
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

//prevent view engine complaints
app.set('view engine', 'jade');

app.get('/', async (req, res) => {
  //CHANGE THIS
  const boards = await db.helpers.getBoards();
  res.json(boards)
})

// BOARDS //

app.get('/boards', async (req, res) => {
  const boards = await db.helpers.getBoards();
  res.json(boards)
})

// Either id based params (the easy way) or hard coded board topics into url (e.g. /java or /algorithms, etc)
app.get('/boards/:id', async(req, res) => {
  try {
    let id = req.params.id
    const board = await db.helpers.getBoard(id)
    const topics = await db.helpers.getTopics(id);
    res.json({
      board: board,
      topics: topics
    })
  } catch (err) {
    console.log("Redirect or 404 here")
  }
  
})

//could probably attach query string for further page calls
app.get('/boards/:id/latest', async(req, res) => {
  try {
    let id = req.params.id
    const board = await db.helpers.getBoard(id)
    const topics = await db.helpers.getTopicsByRange(id, 0, 10);
    res.json({
      board: board,
      topics: topics
    })
  } catch (err) {
    console.log("Redirect or 404 here")
  }
})

app.post('/boards', async (req, res) => {
  let title = req.body.title;
  const board = await db.helpers.addBoard(title);
  res.redirect(303, '/boards')
})

app.put('/boards/:boardId', async (req, res) => {
  let boardId = req.params.boardId;
  let boardTitle = req.body.boardTitle;
  await db.helpers.editBoard(boardId, boardTitle)
  res.redirect(303, '/boards')
})

app.delete('/boards/:boardId', async (req, res) => {
  let boardId = req.params.boardId;
  const deletedBoard = await db.helpers.deleteBoard(boardId);
  res.redirect(303, '/boards');
})

// TOPICS AND POSTS //

app.post('/boards/:boardId', async (req, res) => {
  let boardId = req.params.boardId;
  let question = req.body.question
  await db.helpers.addTopic(boardId, question);
  res.redirect(`/boards/${boardId}`)
})


app.get('/boards/:boardId/topics/:topicId', async (req, res) => {
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

app.delete('/boards/:boardId/topics/:topicId', async (req, res) => {
  let topicId = req.params.topicId
  await db.helpers.deleteTopic(topicId)
  res.redirect(302, '/')
})

app.post('/boards/:boardId/topics/:topicId', async(req, res) => {
  let boardId = req.params.boardId;
  let topicId = req.params.topicId
  let text = req.body.text
  await db.helpers.addPost(topicId, text)
  res.redirect(302, `/boards/${boardId}/topics/${topicId}`);
})

//CHANGING THESE ENDPOINT LATER IF NEEDED
app.delete('/boards/:boardId/topics/:topicId/delete', async(req, res) => {
  let boardId = req.params.boardId;
  let topicId = req.params.topicId
  let postId = req.body.postId;
  await db.helpers.deletePost(postId);
  res.redirect(302, `/boards/${boardId}/topics/${topicId}`);
})

app.put('/boards/:boardId/topics/:topicId/edit', async(req, res) => {
  let boardId = req.params.boardId;
  let topicId = req.params.topicId
  let postText = req.body.text;
  await db.helpers.editPost(topicId, postText)
  res.redirect(302, `/boards/${boardId}/topics/${topicId}`);
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
