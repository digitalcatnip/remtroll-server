# RemTroll Server
RemTroll is a lightweight Node.js HTTP server that acts as a connection point
for the RemTroll mobile app.

It is developed by [Digital Catnip](http://catnip.io).

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
2. Start the server: `remtroll`
3. `remtroll --setup`
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
to create a self-signed certificate before adding the server to your app.
