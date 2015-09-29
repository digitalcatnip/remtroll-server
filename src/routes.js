var express = require('express');
var router = express.Router();
var handler = require(__dirname + '/handler').RemTrollHandler;

router.get('/', function(req, res) {
  res.send(handler.getBody());
});

//Respond to pings!
router.get('/ping', function(req, res) {
  res.json(handler.getPing());
});

router.get('/mac', function(req, res) {
  var err = {'error': 'Missing parameter'};
  res.json(err);
});

//Respond to mac!
router.get('/mac/:iface', function(req, res) {
  console.log('MAC for ' + req.params.iface + ' received from ' + req.ip);
  res.json(handler.getMacForIFace(req.params.iface));
});

router.get('/shutdown', function(req, res) {
  var err = {'error': 'Missing parameter'};
  res.json(err);
});

//Respond to shutdown!
router.get('/shutdown/:phrase', function(req,res) {
  res.json(handler.shutdown(req.params.phrase));
});

module.exports = router;
