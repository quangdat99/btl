var express = require('express');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/work_management').then(()=>{
	console.log("Connect db success");
	app.listen(port, function () {
		console.log('Server listening on port '+ port);
	});
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

// var jsonParser = bodyParser.json();
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
// app.use(jsonParser);
// app.use(urlencodedParser);

app.use(express.static('public'));

app.get('/', function(req, res) {
	res.render('home');
});

app.use('/board', boardRoute);
app.use('/user', userRoute);
app.use('/group', groupRoute);
app.use('/authentication', authenticationRoute);

