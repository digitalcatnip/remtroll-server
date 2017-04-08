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
const os = require('os');
const path = require('path');
const child_process = require('child_process'); // eslint-disable-line camelcase
const prompt = require('prompt');
const colors = require('colors/safe');

let cfg = {};
let isValid = false;
let defaults = {};

const INIT_SYSTEMD = 1;
const INIT_SYSV = 2;
const INIT_RC = 3;

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

        const plat = os.platform();

        this.isMac = plat === 'darwin';
        this.isWin = plat.includes('win');
        this.isUnix = !this.isMac && !this.isWin;
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
    getDefaultConfigPath() {
        if (this.isMac)
            return '/Library/Application Support/remtroll/';
        else if (this.isWin)
            return `${process.env.ALLUSERSPROFILE}\\remtroll\\`;
        return '/etc/remtroll';
    },
    generateInitPath(choice) {
        if (choice === INIT_SYSTEMD)
            return '/lib/systemd/system';
        else if (choice === INIT_SYSV)
            return '/etc/init.d';
        return '/etc/rc.d';
    },
    generateInstallPrompt() {
        let pathValid = '^.*$';
        const override = {};

        if (this.isMac) {
            override.configDir = '/Library/Application Support/remtroll/';
            override.initDir = '/Library/LaunchDaemons/';
        } else if (this.isWin) {
            pathValid = '^([a-zA-Z]:)?(\\[^<>:"/\\|?*]+)+\\?$';
            override.configDir = `${process.env.ALLUSERSPROFILE}\\remtroll\\`;
            override.initDir = 'win';
        }

        prompt.override = override;
        const self = this;
        const installPrompt = [
            {
                name: 'configDir',
                type: 'string',
                required: true,
                description: colors.white('What is the directory where should we install the config?'),
                default: '/etc/remtroll/',
                pattern: pathValid,
                message: 'Invalid directory path',
            },
            {
                name: 'shouldInstallInit',
                type: 'boolean',
                required: true,
                description: colors.white('Do you want to setup RemTroll as a service?'),
                default: false,
            },
            {
                name: 'initSystem',
                type: 'integer',
                ask: () => this.isUnix && prompt.history('shouldInstallInit'),
                default: 1,
                required: true,
                description: colors.white(
                    `Choose a valid init system:
                        ${INIT_SYSTEMD}. systemd (RedHat, Ubuntu, Debian)
                        ${INIT_SYSV}. OpenRC (Slackware, Gentoo)
                        ${INIT_RC}. rc (FreeBSD)
                    : `),
            },
            {
                name: 'initDir',
                type: 'string',
                required: true,
                description: colors.white('Where should we install your start script?'),
                default: '/etc/init.d',
                ask: () => this.isUnix && prompt.history('shouldInstallInit').value && prompt.history('initSystem').value == INIT_SYSV,
            },
            {
                name: 'sysdInitDir',
                type: 'string',
                required: true,
                description: colors.white('Where should we install your start script?'),
                default: '/usr/lib/systemd/system',
                ask: () => {
                    console.log(`OS is ${this.isUnix}, InstallInit is ${prompt.history('shouldInstallInit').value}, system is ${prompt.history('initSystem').value}`);
                    return this.isUnix && prompt.history('shouldInstallInit').value && prompt.history('initSystem').value == INIT_SYSTEMD;
                }
            },
            {
                name: 'rcInitDir',
                type: 'string',
                required: true,
                description: colors.white('Where should we install your start script?'),
                default: '/etc/rc.d',
                ask: () => this.isUnix && prompt.history('shouldInstallInit').value && prompt.history('initSystem').value == INIT_RC,
            },
            {
                name: 'initUser',
                type: 'string',
                required: true,
                pattern: '.*',
                description: colors.white('What user should RemTroll run as?'),
                default: 'root',
                ask: () => this.isUnix && prompt.history('shouldInstallInit').value,
            },
            {
                name: 'initGroup',
                type: 'string',
                required: true,
                pattern: '.*',
                description: colors.white('What group should RemTroll run as?'),
                default: 'wheel',
                ask: () => this.isUnix && prompt.history('shouldInstallInit').value,
            },
        ];

        return installPrompt;
    },
    writeInitFile(configPath, initPath, initUser, initGroup, initSystem) {
        let infile = '../init/remtroll_openrc.sh';
        let outfile = 'remtroll.sh';
        let postCommand = '';
        if (this.isMac) {
            infile = '../init/remtroll_launchd.plist';
            outfile = 'remtroll.plist';
        } else if (this.isWin) {
        } else if (initSystem === INIT_SYSV)
            infile = '../init/remtroll_bsd.sh';
        else if (initSystem === INIT_SYSTEMD) {
            infile = '../init/remtroll_systemd.service';
            outfile = 'remtroll.service';
            postCommand = 'systemctl enable remtroll.service && systemctl start remtroll.service';
        }

        let initContents = fs.readFileSync(path.join(__dirname, infile), 'utf8');
        initContents = initContents.replace('{config}', configPath);
        initContents = initContents.replace('{user}', initUser);
        initContents = initContents.replace('{group}', initGroup);
        const filename = path.join(initPath, outfile);
        fs.writeFileSync(filename, initContents);
        if (postCommand !== '')
            child_process.exec(postCommand, (error) => {
                if (error != null)
                    console.log(colors.red(`Error while running ${postCommand}: ${error.code}`));
                else
                    console.log(colors.green(`Service setup at: ${filename}`));
                process.exit();
            });
        else {
            console.log(colors.green(`Service setup at: ${filename}\n`));
            console.log(colors.green('Please add remtroll to your default run level.'));
            if (this.isMac)
                console.log(colors.green(`Run command 'launchctl ${filename}' to do this`));
            process.exit();
        }
    },
    continueInstall(newConfig, installResponse) {
        const filename = path.join(installResponse.configDir, 'remtroll.cfg');
        fs.writeFileSync(filename, JSON.stringify(newConfig, null, '\t'));
        console.log('Updated configuration successfully!');
        if (installResponse.shouldInstallInit) {
            let dir = installResponse.initDir;
            if (installResponse.initSystem == INIT_SYSTEMD)
                dir = installResponse.sysdInitDir;
            else if (installResponse.initSystem == INIT_RC)
                dir = installResponse.rcInitDir;
            this.writeInitFile(filename, dir, installResponse.initUser, installResponse.initGroup, installResponse.initSystem);
        }
    },
    installConfig(newConfig) {
        prompt.start();
        const self = this;
        prompt.get(this.generateInstallPrompt(), (err, result) => {
            if (err != null && err.toString().includes('canceled')) {
                console.log('\nConfiguration not saved.\n');
                return;
            }
            if (err != null) {
                console.log(`\n\nEncountered error! ${err}\n`);
                return;
            }
            if (!fs.existsSync(result.configDir))
                fs.mkdir(result.configDir, 0o775, (error) => {
                    if (error) {
                        console.log(colors.red(`Unable to save config: ${error}`));
                        console.log(colors.red('Do you have permissions to save the file?'));
                    } else
                        self.continueInstall(newConfig, result);
                });
            else
                self.continueInstall(newConfig, result);
        });
    },
    editConfig(filename) {
        this.readConfig(filename);
        console.log('Starting configuration!  Hit enter to keep the current value for the config.');

        prompt.message = '';
        prompt.delimiter = colors.green(': ');
        prompt.start();
        const self = this;
        prompt.get(configPrompt, (err, result) => {
            if (err != null && err.toString().includes('canceled')) {
                console.log('\nConfiguration not saved.\n');
                return;
            }
            if (err != null) {
                console.log(colors.red(`\n\nEncountered error! ${err}\n`));
                return;
            }
            self.installConfig(result);
            // prompt.stop();
        });
    },
};
