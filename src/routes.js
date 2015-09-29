//    RemTroll Routes - Route RemTroll app requests to the right request handler
//    Copyright (C) 2015  James McCarthy
//
//    This program is free software; you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation; either version 2 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License along
//    with this program; if not, write to the Free Software Foundation, Inc.,
//    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

var express = require('express');
var router = express.Router();
var handler = require(__dirname + 'src/handler').RemTrollHandler;

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
