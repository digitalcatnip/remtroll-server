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

const os = require('os');
const exec = require('child_process').exec;
const path = require('path');
const pjson = require('../package.json');


const config = require(path.join(__dirname, 'config.js')).Config;

exports.RemTrollHandler = {
    getMacForIFace(iface) {
        const interfaces = os.networkInterfaces();
        const result = {
            mac: '',
        };
        for (let j = 0; j < interfaces.length; j += 1) {
            const inter = interfaces[j];
            if (inter.toLowerCase() === iface.toLowerCase()) {
                const elements = interfaces[iface];
                for (let i = 0; i < elements.length; i += 1) {
                    const data = elements[i];
                    if (data.family.toLowerCase() === 'ipv4') {
                        console.log(`mac is ${data.mac}`);
                        result.mac = data.mac;
                    }
                }
            }
        }

        return result;
    },
    getAllMacs() {
        const interfaces = os.networkInterfaces();
        const results = [];
        const ifaces = Object.keys(interfaces);
        for (let j = 0; j < ifaces.length; j += 1) {
            const iface = ifaces[j];
            const elements = interfaces[iface];
            for (let i = 0; i < elements.length; i += 1) {
                const result = {};
                const data = elements[i];
                if (!data.internal && 'mac' in data && 'family' in data && 'address' in data) {
                    result.mac = data.mac;
                    result.protocol = data.family.toLowerCase();
                    result.address = data.address;
                    results.push(result);
                }
            }
        }
        return results;
    },
    getBody() {
        return '<html><body><h1>Hello!</h1></body></html>';
    },
    getPing() {
        console.log('In ping');
        return {ping: true, version: pjson.version};
    },
    shutdown(passphrase) {
        const actualPw = config.getConfigElement('shutphrase');
        if (actualPw !== passphrase) {
            console.log('Invalid passphrase specified');
            return {error: 'Invalid passphrase'};
        }
        const osType = os.type();
        const puts = (error, stdout) => {
            console.log(stdout);
        };
        if (osType === 'Linux' || osType === 'Darwin' || osType === 'FreeBSD')
            exec('sudo shutdown -h now', puts);
        else if (osType === 'Windows_NT')
            // Are we windows?
            exec('shutdown /s', puts);

        return {result: true};
    },
};
