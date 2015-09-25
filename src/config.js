//    RemTroll Config - Configure the environment for RemTroll server
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

var fs = require('fs');
var cfg = {};
var isValid = false;
var defaults = {};

exports.Config = {
  initialize : function() {
    cfg = {};
    isValid = false;
    defaults = {
      'port'        : 3000,
      'secure'      : false,
      'shutphrase'  : 'supersecret'
    };
  },
  readConfig : function (filename) {
    var data = fs.readFileSync(filename);
    try
    {
      cfg = JSON.parse(data);
      console.log('Config file has been read.');
      this.validateConfig();
    }
    catch (err)
    {
      isValid = false;
      console.log('There has been an error parsing the config.')
      console.log(err);
    }
  },
  getDefaultForElement : function (element) {
    if( element in defaults)
      return defaults[element];
    else
      return false;
  },
  getConfigElement : function (element) {
    if( element in cfg )
      return cfg[element];
    else
      return this.getDefaultForElement(element);
  },
  validateConfig : function() {
    isValid = true;
    if(this.getConfigElement('secure'))
    {
      if(this.getConfigElement('privkey') === false)
      {
        console.log('You must specify a private key if you want to use https!');
        isValid = false;
      }

      if(this.getConfigElement('pubcert') === false)
      {
        console.log('You must specify a public key if you want to use https!');
        isValid = false;
      }
    }
  },
  isConfigValid : function () {
    return isValid;
  }
};
