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

const express = require('express');
const path = require('path');

const router = express.Router(); // eslint-disable-line new-cap
const handler = require(path.join(__dirname, 'handler')).RemTrollHandler;

router.get('/', (req, res) => {
    res.send(handler.getBody());
});

// Respond to pings!
router.get('/ping', (req, res) => {
    res.json(handler.getPing());
});

router.get('/mac', (req, res) => {
    const err = {error: 'Missing parameter'};
    res.json(err);
});

// Respond to mac!
router.get('/mac/:iface', (req, res) => {
    console.log(`MAC for ${req.params.iface} received from ${req.ip}`);
    res.json(handler.getMacForIFace(req.params.iface));
});

router.get('/shutdown', (req, res) => {
    const err = {error: 'Missing parameter'};
    res.json(err);
});

// Respond to shutdown!
router.get('/shutdown/:phrase', (req, res) => {
    res.json(handler.shutdown(req.params.phrase));
});

module.exports = router;
