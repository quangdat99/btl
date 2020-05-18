var express = require('express');
// var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/btl');

var boardRoute = require('./routes/board.route');
var groupRoute = require('./routes/group.route');
var userRoute = require('./routes/user.route');


var port = 3001;

var app = express();
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser("abc123xyz"));
app.use(express.static('public'));



app.use('/board', boardRoute);
app.use('/user', userRoute);
app.use('/group', groupRoute);

app.listen(port, function () {
	console.log('Server listening on port '+ port);
});