var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var cors = require('cors')
var app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server)


const port = 8080;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public'), { index: ['index.html'] }));


// internal modules
const db = require('./models/db')
app.use(cors());
app.set('view engine', 'jade');

app.get('/', async (req, res) => {
  const board = {name: "Bob"};
  res.json(board)
})

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });



app.listen(port);



module.exports = app;
