#! /usr/bin/env node
// -*- js -*-

//    RemTroll Server - Send data to the RemTroll mobile app
//    Copyright (C) 2017  James McCarthy
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

const http = require('http');
const https = require('https');
const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const routes = require('./routes');
const colors = require('colors/safe');
const config = require('./config').Config;
const setup = require('./setup').Setup;

const app = express();
config.initialize();
let cfgFile = path.join(config.getDefaultConfigPath(), '/remtroll.cfg');
if (!fs.existsSync(cfgFile)) {
    console.log(colors.red(`Using configuration from npm - this could get overwritten on \'npm update\'.
        If you are running \'remtroll --config\' please ignore this message.`));
    cfgFile = path.join(__dirname, '../cfg/remtroll.cfg');
}

if (process.argv.length >= 3 && (process.argv[2] === '--config' || process.argv[2] === 'config'))
    if (process.argv.length === 3)
        config.editConfig(cfgFile);
    else
        config.editConfig(process.argv[4]);
else if (process.argv.length === 3 && process.argv[2] === '--setup') {
    config.readConfig(cfgFile);
    if (!config.isConfigValid())
        console.log('The config is not valid so exiting...');
    else
        setup.runSetup();
} else {
    // Check for config file argument
    if (process.argv.length > 3) {
        console.log('The config file path should be the only argument.');
        process.exit();
    } else if (process.argv.length === 3)
        cfgFile = process.argv[2];

    // Load the config file
    config.readConfig(cfgFile);
    if (config.isConfigValid()) {
        console.log('Config file has been read successfully');
        // Setup server - redirect errors to views and set the configured port.
        app.set('port', process.env.PORT || config.getConfigElement('port'));
        app.set('views', '../views');
        app.set('view engine', 'jade');
        app.disable('etag');

        // CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
        app.all('*', (req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'X-Requested-With');
            next();
        });

        // add timestamps in front of log messages
        // since logger only returns a UTC version of date, I'm defining my own date format - using an internal module from console-stamp
        morgan.format('mydate', () => {
            const df = require('console-stamp/node_modules/dateformat'); // eslint-disable-line global-require

            return df(new Date(), 'HH:MM:ss.l');
        });
        app.use(morgan('[:mydate] :method :url :status :res[content-length] - :remote-addr - :response-time ms'));

        // Setup routing to routes.js
        app.use('/', routes);
        app.use((req, res) => {
            res.render('404', {url: req.url});
        });

        // If we're not secure, bind to port using HTTP
        // Otherwise configure security and bind using HTTPS
        if (!config.getConfigElement('secure'))
            http.createServer(app).listen(app.get('port'), () => {
                console.log(`Express server using http on port ${config.getConfigElement('port')}`);
            });
        else {
            const options = {};
            options.key = fs.readFileSync(config.getConfigElement('privkey'));
            options.cert = fs.readFileSync(config.getConfigElement('pubcert'));
            if (config.getConfigElement('keypass') !== false)
                options.passphrase = config.getConfigElement('keypass');
            if (config.getConfigElement('cacert') !== '')
                options.ca = fs.readFileSync(config.getConfigElement('cacert'));
            https.createServer(options, app).listen(app.get('port'), () => {
                console.log(`Express server using https on port ${config.getConfigElement('port')}`);
            });
        }
    } else
        console.log('The config is not valid so exiting...');
}
