var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

// var User = require('./models/user.model');
// var List = require('./models/list.model');
// var Board = require('./models/board.model');
// var Group = require('./models/group.model');
// var Recent = require("./models/recent.model");


mongoose.connect('mongodb://localhost/work_management').then(()=>{
	console.log("Connect db success");
	
}).catch(e=>{
	console.log("Connect db fail");
});

var taskRoute = require('./routes/task.route');
var listRoute = require('./routes/list.route');
var boardRoute = require('./routes/board.route');
var groupRoute = require('./routes/group.route');
var userRoute = require('./routes/user.route');
var cardRoute = require('./routes/card.route');
var indexRoute = require('./routes/index.route');


var authenticationRoute = require("./routes/authentication.route");

var homeRoute = require('./routes/home.route');

var searchRoute = require("./routes/search.route");


var port = 3001;

var app = express();
app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser())
app.use(cookieParser('MY SECRET'))

// var jsonParser = bodyParser.json();
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
// app.use(jsonParser);
// app.use(urlencodedParser);

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
app.use('/index', indexRoute);



app.use('/authentication', authenticationRoute);

app.use('/home', homeRoute);

app.use('/search', searchRoute);


var server = app.listen(port, function () {
	console.log('Server listening on port '+ port);
});

const io = require("socket.io")(server);
io.on("connection", (socket) => {
  console.log("new Connection")
  // socket.emit("news", { route: "first connect" });
  // socket.on('disconnect', ()=>{
	//   console.log("socket disconnect");
  // })
  // socket.on("my other event", (data) => {
  //   console.log(data);
  // });
});
io.on('disconnect', (_socket) => {
	// console.log("socket disconnect");
  });

global.socket = io;

