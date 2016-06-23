var express = require('express');
var request = require('request');

var app = express();
var cors = require('cors');
app.use(cors());




app.use('/', function(req, res) {
console.log("rew url= " + req.url);
console.log("url= " + req.url.replace('/?url=',''));
  var url = 'http://get-table-server.azurewebsites.net' + req.url.replace('/?url=','');
  console.log("new url= " + url);
  req.pipe(request(url)).pipe(res);
});

// app.use('/proxy', function(req, res) {
//   var url = req.url.replace('/?url=','');
//   req.pipe(request(url)).pipe(res);
// });

app.listen(process.env.PORT || 3000);
