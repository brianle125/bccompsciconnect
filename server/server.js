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
const path = require("path");
const fs = require("fs");
//for future automatic refreshing
const io = require('socket.io')(server)


const port = process.env.PORT || 8080;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use('/', express.static(path.join(__dirname, 'public'), { index: ['index.html'] }));
app.use(express.static('../frontend/src'))

// internal modules
const db = require('./models/db')
app.use(cors());

//prevent view engine complaints
app.set('view engine', 'jade');

app.get('/', async (req, res) => {
  const boards = await db.helpers.getBoards();
  return res.json(boards)
})


//IN PROGRESS
// Either id based params (the easy way) or hard coded board topics into url (e.g. /java or /algorithms, etc)
app.get('/boards/:id', async(req, res) => {
  let id = req.params.id
  const board = await db.helpers.getBoard(id)
  res.json(board)
})

app.get('/boards/:boardId/topic/:topicId', async (req, res) => {
  let boardId = req.params.boardId;
  let topicId = req.params.topicId;
  const topic = await db.helpers.getTopic(topicId);
  console.log(topic)
  res.json(topic);
})

//handle topic and message posting
app.post('/boards/:boardId/topic/:topicId', async (req, res) => {
  await db.helpers.addTopic(0, 'something');
  res.redirect('/')
})


//editing

//deleting


// Initialize the database
async function InitDB() {
  await db.helpers.init()
  console.log("success")
}

InitDB().then(() => {
  app.listen(port);
  console.log(`Listening on port ${port}`)
})
.catch((err) => { console.log(err)})




module.exports = app;