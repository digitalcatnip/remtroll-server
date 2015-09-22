var http = require('http'),
  express = require('express'),
  os = require('os'),
  morgan = require('morgan');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');

//add timestamps in front of log messages
//since logger only returns a UTC version of date, I'm defining my own date format - using an internal module from console-stamp
morgan.format('mydate', function() {
    var df = require('console-stamp/node_modules/dateformat');
    return df(new Date(), 'HH:MM:ss.l');
});
app.use(morgan('[:mydate] :method :url :status :res[content-length] - :remote-addr - :response-time ms'));

app.get('/', function(req, res) {
  var handler = require('./handler.js').RemTrollHandler;
  res.send(handler.getBody());
});

//Respond to pings!
app.get('/ping', function(req, res) {
  var handler = require('./handler.js').RemTrollHandler;
  res.json(handler.getPing());
});

app.get('/mac', function(req, res) {
  res.render('400', {url:req.url});
});

//Respond to mac!
app.get('/mac/:iface', function(req, res) {
  console.log('MAC for ' + req.params.iface + ' received from ' + req.ip);
  var handler = require('./handler.js').RemTrollHandler;
  res.json(handler.getMacForIFace(req.params.iface));
});

//Respond to shutdown!
app.get('/shutdown', function(req, res) {
  var handler = require('./handler.js').RemTrollHandler;
  res.json(handler.shutdown());
});

app.use(function(req, res) {
  res.render('404', {url:req.url});
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port 3000');
});
