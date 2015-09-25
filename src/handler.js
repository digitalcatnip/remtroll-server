//    RemTroll Handler - Handle requests to the RemTroll Server
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

var os = require('os');
var sys = require('sys');
var exec = require('child_process').exec;
var config = require('./config.js').Config;

exports.RemTrollHandler = {
  getMacForIFace: function(iface) {
    var interfaces = os.networkInterfaces();
    var result = {
      mac: ''
    };
    for (var interface in interfaces) {
      if (interface.toLowerCase() == iface.toLowerCase()) {
        var elements = interfaces[interface];
        for (var i = 0; i < elements.length; i++) {
          data = elements[i];
          if (data.family.toLowerCase() === 'ipv4') {
            console.log('mac is ' + data.mac);
            result.mac = data.mac;
          }
        }
      }
    }

    return result;
  },
  getBody: function() {
    return '<html><body><h1>Hello!</h1></body></html>';
  },
  getPing: function() {
    return {
      ping: true
    };
  },
  shutdown: function(passphrase) {
    var actualPw = config.getConfigElement('shutphrase');
    if(actualPw != passphrase)
    {
      console.log('Invalid passphrase specified');
      return {result: false};
    }
    var osType = os.type();
    var puts = function(error, stdout, stderr) { console.log(stdout) };
    if(osType == 'Linux' || osType == 'Darwin')
    {
      exec("sudo shutdown -h now", puts);
    }
    else if(osType =='Windows_NT')
    {
      //Are we windows?
      exec("shutdown /s", puts);
    }

    return {result: true};
  },
};
