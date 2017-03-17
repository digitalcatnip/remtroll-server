//    RemTroll Config - Configure the environment for RemTroll server
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

const fs = require('fs');
const prompt = require('prompt');
const colors = require('colors/safe');

let cfg = {};
let isValid = false;
let defaults = {};

const configPrompt = [
    {
        name: 'secure',
        type: 'boolean',
        required: true,
        description: colors.white('Should RemTroll use HTTPS?'),
        message: 'Please answer t, f, true, false',
    },
    {
        name: 'port',
        type: 'integer',
        description: colors.white('What port should we listen on?'),
        message: 'Port should be greater than 1023 and less than 49152',
        required: true,
        conform: (value) => value > 1023 && value < 49152,
    },
    {
        name: 'shutphrase',
        type: 'string',
        hidden: true,
        required: true,
        description: colors.white('What password should RemTroll require for commands?'),
    },
    {
        name: 'privkey',
        type: 'string',
        required: false,
        description: colors.white('What is the path to your private key for SSL?'),
        default: '',
        ask: () => prompt.history('secure').value,
    },
    {
        name: 'pubcert',
        type: 'string',
        required: false,
        description: colors.white('What is the path to your public key for SSL?'),
        default: '',
        ask: () => prompt.history('secure').value,
    },
    {
        name: 'keypass',
        type: 'string',
        required: false,
        hidden: true,
        description: colors.white('What is the password to your private key for SSL?'),
        default: '',
        ask: () => prompt.history('secure').value,
    },
    {
        name: 'cacert',
        type: 'string',
        required: false,
        description: colors.white('What is the path to your certificate authority certificate for SSL?'),
        default: '',
        ask: () => prompt.history('secure').value,
    },
];

exports.Config = {
    initialize() {
        cfg = {};
        isValid = false;
        defaults = {
            port: 3000,
            secure: false,
            shutphrase: 'supersecret',
        };
    },
    readConfig(filename) {
        try {
            const data = fs.readFileSync(filename);
            cfg = JSON.parse(data);
            console.log('Config file has been read.');
            this.validateConfig();
            configPrompt[0].default = this.getConfigElement('secure');
            configPrompt[1].default = this.getConfigElement('port');
            configPrompt[2].default = this.getConfigElement('shutphrase');
            configPrompt[3].default = this.getConfigElement('privkey');
            configPrompt[4].default = this.getConfigElement('pubcert');
            configPrompt[5].default = this.getConfigElement('keypass');
            configPrompt[6].default = this.getConfigElement('cacert');
        } catch (err) {
            isValid = false;
            console.log('There has been an error parsing the config.');
        }
    },
    getDefaultForElement(element) {
        if (element in defaults)
            return defaults[element];
        else if (element === 'secure')
            return false;
        else if (element === 'port')
            return 3000;
        return '';
    },
    getConfigElement(element) {
        if (element in cfg)
            return cfg[element];
        return this.getDefaultForElement(element);
    },
    validateConfig() {
        isValid = true;
        if (this.getConfigElement('secure')) {
            if (this.getConfigElement('privkey') === false) {
                console.log('You must specify a private key if you want to use https!');
                isValid = false;
            }

            if (this.getConfigElement('pubcert') === false) {
                console.log('You must specify a public key if you want to use https!');
                isValid = false;
            }
        }
    },
    isConfigValid() {
        return isValid;
    },
    editConfig(filename) {
        this.readConfig(filename);
        console.log('Starting configuration!  Hit enter to keep the current value for the config.');

        prompt.message = '';
        prompt.delimiter = colors.green(': ');
        prompt.start();
        prompt.get(configPrompt, (err, result) => {
            fs.writeFileSync(filename, JSON.stringify(result, null, '\t'));
            console.log('Updated configuration successfully!');
            process.exit();
        });
    },
};
