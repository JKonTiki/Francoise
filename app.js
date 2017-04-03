var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

// middlewares
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/build'));

// routes
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname + '/build/index.html'));
})

// run server
app.listen(3000, function(){
  console.log('Server launched on port 3000');
})
