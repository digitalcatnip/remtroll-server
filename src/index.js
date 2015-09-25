//    RemTroll Server - Send data to the RemTroll mobile app
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

var http = require('http'),
  https = require('https'),
  express = require('express'),
  os = require('os'),
  fs = require('fs'),
  morgan = require('morgan'),
  routes = require('./routes'),
  config = require('./config').Config;
var app = express();
var cfgFile = './cfg/remtroll.cfg';

if(process.argv.length > 3)
{
  console.log("The config file path should be the only argument.");
  process.exit();
}
else if( process.argv.length == 3)
{
  cfgFile = process.argv[2];
}

config.readConfig(cfgFile);
if (config.isConfigValid())
{
  app.set('port', process.env.PORT || config.getConfigElement('port'));
  app.set('view engine', 'jade');

  //add timestamps in front of log messages
  //since logger only returns a UTC version of date, I'm defining my own date format - using an internal module from console-stamp
  morgan.format('mydate', function() {
    var df = require('console-stamp/node_modules/dateformat');
    return df(new Date(), 'HH:MM:ss.l');
  });
  app.use(morgan('[:mydate] :method :url :status :res[content-length] - :remote-addr - :response-time ms'));

  app.use('/', routes);
  app.use(function(req, res) {
    res.render('404', {
      url: req.url
    });
  });

  if(!config.getConfigElement('secure'))
  {
    http.createServer(app).listen(app.get('port'), function() {
      console.log('Express server using http on port ' + config.getConfigElement('port'));
    });
  }
  else
  {
    var options = {};
    options.key = fs.readFileSync(config.getConfigElement('privkey'));
    options.cert = fs.readFileSync(config.getConfigElement('pubcert'));
    if(config.getConfigElement('keypass') !== false)
      options.passphrase = config.getConfigElement('keypass');
    if(config.getConfigElement('cacert') !== false)
      options.ca = fs.readFileSync(config.getConfigElement('cacert'));
    https.createServer(options, app).listen(app.get('port'), function() {
      console.log('Express server using https on port ' + config.getConfigElement('port'));
    });
  }

}
else {
  console.log('The config is not valid so exiting...');
}
