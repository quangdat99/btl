var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/work_management').then(()=>{
	console.log("Connect db success");
	
}).catch(e=>{
	console.log("Connect db fail");
});

var searchRoute = require("./routes/search.route");
var homeRoute = require('./routes/home.route');
var taskRoute = require('./routes/task.route');
var listRoute = require('./routes/list.route');
var boardRoute = require('./routes/board.route');
var groupRoute = require('./routes/group.route');
var userRoute = require('./routes/user.route');
var cardRoute = require('./routes/card.route');
var commentRoute = require('./routes/comment.route');
var authenticationRoute = require("./routes/authentication.route");

const PORT = 3001;

var app = express();
app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser())
app.use(cookieParser('MY SECRET'))
app.use(express.static('public'));

app.get('/', function(req, res) {
	res.render('index');
});
app.use('/task', taskRoute);
app.use('/list', listRoute);
app.use('/board', boardRoute);
app.use('/user', userRoute);
app.use('/group', groupRoute);
app.use('/card', cardRoute);
app.use('/comment', commentRoute);
app.use('/authentication', authenticationRoute);
app.use('/home', homeRoute);
app.use('/search', searchRoute);


var server = app.listen(PORT, function () {
	console.log('Server listening on port '+ PORT);
});

const io = require("socket.io")(server);
io.on("connection", (socket) => {
  	console.log("new Connection")
});
io.on('disconnect', (_socket) => {
	console.log("socket disconnect");
});

global.socket = io;

const Scheduler = require("./script/Scheduler").Scheduler;
Scheduler.start();
// Scheduler.notify()