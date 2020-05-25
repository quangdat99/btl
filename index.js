var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/work_management').then(()=>{
	console.log("Connect db success");
	
}).catch(e=>{
	console.log("Connect db fail");
});

var boardRoute = require('./routes/board.route');
var groupRoute = require('./routes/group.route');
var userRoute = require('./routes/user.route');
var authenticationRoute = require("./routes/authentication.route");

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
app.get('/home', function(req, res) {
	res.render('home');
});

app.use('/board', boardRoute);
app.use('/user', userRoute);
app.use('/group', groupRoute);
app.use('/authentication', authenticationRoute);

var server = app.listen(port, function () {
	console.log('Server listening on port '+ port);
});

const io = require("socket.io")(server);
io.on("connection", (socket) => {
  console.log("== new connection _ session id: " + socket.id);
  socket.emit("news", { route: "first connect" });
  socket.on('disconnect', ()=>{
	  console.log("socket disconnect");
  })
  socket.on("my other event", (data) => {
    console.log(data);
  });
});
io.on('disconnect', (_socket) => {
	console.log("socket disconnect");
  });


var pS = require("./socketMapper");
global.socketMapper = new pS();
global.socketMapper.appendSocket(100, 5);

