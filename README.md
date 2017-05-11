# RemTroll Server
RemTroll is a lightweight Node.js HTTP server that acts as a connection point
for the RemTroll mobile app.

Find out more about the app [on our website](https://remtroll.com).

1. [Installation](#installation)
2. [Initial Setup](#initial-setup)
3. [Configuration](#configuration)
4. [Security](#security)

# Installation
To install from the command line, run:

`npm install remtroll-server -g`

# Initial setup
Follow these steps to setup the server.

1. `remtroll --config`
2. `remtroll --setup`
3. Start the server: `remtroll`
4. In the RemTroll app, enter the 4 digit code and it will self configure.

# Configuration
You can run `remtroll --config` to run through the configuration options and edit
the default configuration file.

See [the wiki](https://github.com/digitalcatnip/remtroll-server/wiki) for details
on what each configuration option means.

If you have a custom configuration file, you can run the server with the command
`remtroll <path to config>`.

# Security
By default, the server is configured to run without security.  We recommend changing this by
following instructions on [the wiki](https://github.com/digitalcatnip/remtroll-server/wiki#self-signed-certificate)
to create a self-signed certificate before adding the server to your app. Once you've
done that you can update the configuration with the path to your new private key
and public certificate.

We also recommend you wait until you have the security setup until you upload
the configuration to the app using `remtroll --setup`
