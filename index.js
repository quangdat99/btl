var express = require('express');
// var cookieParser = require('cookie-parser');
// var mongoose = require('mongoose');

var port = 3001;

var app = express();
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser("abc123xyz"));
app.use(express.static('public'));

app.get('/', function(req, res) {
	res.render('home');
});

app.listen(port, function () {
	console.log('Server listening on port '+ port);
});