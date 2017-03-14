/**
* @Author: James McCarthy <james>
* @Date:   2017-02-16T18:01:42-05:00
* @Email:  james@catnip.io
* @Filename: setup.js
* @Last modified by:   james
* @Last modified time: 2017-03-14T16:23:20-04:00
* @Copyright: Copyright 2017, Digital Catnip
*/
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

const handler = require('./handler').RemTrollHandler;
const fetch = require('node-fetch');
const config = require('./config').Config;
const fs = require('fs');

let crypto = null;
try {
    crypto = require('crypto'); // eslint-disable-line global-require
} catch (err) {
    console.log('crypto support is disabled - setup will not function');
}

exports.Setup = {
    verifyCrypto() {
        // Verify the user has the crypto package built into NodeJS
        if (crypto == null) {
            console.log('Unable to generate hashes - please install a NodeJS version with crypto support.');
            return false;
        }

        return true;
    },
    verifyConfig() {
        const secure = config.getConfigElement('secure');
        const pubCert = config.getConfigElement('pubcert');
        if (secure && pubCert === '') {
            console.log('No SSL certificate specified and server is marked secure - please re-run "remtroll --config" to correct');
            return false;
        }
        return true;
    },
    hashInterfaces(body) {
        const networkData = body.data;
        if (networkData.length < 1) {
            console.log('No network interfaces found on your machine.  Please run RemTroll on a computer with networking.');
            return;
        }
        const data = networkData[0];
        body.hash = crypto.createHmac('sha256', data.mac)
            .update(data.address)
            .digest('hex');
    },
    getCurrentOS() {
        const os = process.platform;
        if (os === 'darwin')
            return 'mac';
        else if (os === 'linux')
            return 'linux';
        else if (os.startsWith('win'))
            return 'windows';
        return 'bsd';
    },
    sendRequestToServer(body, hash) {
        const options = {
            method: 'PUT',
            headers: {
                'Api-Key': hash,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        };
        fetch('https://remtroll.herokuapp.com/setup', options)
            .then((res) => {
                if (res.status === 500)
                    return res.text();

                return res.json();
            }).then((json) => {
                if (json == null || typeof json === 'string') {
                    console.log('There was a problem uploading to the server.');
                    console.log('Please make sure you are connected to the internet and try again.');
                    console.log('You can also report error code 500 to RemTroll support.');
                } else if ('alias' in json) {
                    console.log('We\'ve uploaded your server configuration to the cloud.');
                    console.log('You can use the alias we give you to configure the RemTroll app.');
                    console.log(`Your alias is ${json.alias}.`);
                } else {
                    console.log('There was a problem uploading to the server.');
                    console.log('Please make sure you are connected to the internet and try again.');
                    console.log(`You can also report error code ${json.error} to RemTroll support.`);
                }
            }).catch(() => {
                console.log('There was a problem uploading to the server.');
                console.log('Please make sure you are connected to the internet and try again.');
                console.log('You can also report error code 500 to RemTroll support.');
            });
    },
    runSetup() {
        // Verify we have crypto
        if (!this.verifyCrypto() || !this.verifyConfig())
            return;
        // Put together data package for server upload
        const networkData = handler.getAllMacs();
        let cert = '';
        if (config.getConfigElement('secure'))
            cert = fs.readFileSync(config.getConfigElement('pubcert'), 'utf8');

        const data = {
            data: networkData,
            secure: config.getConfigElement('secure'),
            port: config.getConfigElement('port'),
            system: this.getCurrentOS(),
            pubcert: cert,
        };
        this.hashInterfaces(data);
        this.sendRequestToServer(data, data.hash);
    },
};
