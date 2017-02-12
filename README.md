# RemTroll Server
RemTroll is a lightweight Node.js HTTP server that acts as a connection point
for the RemTroll mobile app.

It is developed by [Digital Catnip](http://catnip.io).

# Installation
To install from the command line, run:

`npm install remtroll-server -g`

You will then be able to run remtroll by doing the following:

`remtroll <config path>`

where config path is the path to your configuration file.  This is optional as you can edit the configuration file in the module directory where remtroll-server is installed.

# Configuration
You can run `remtroll --config` to run through the configuration options and edit
the default configuration file.

See [the wiki](https://github.com/digitalcatnip/remtroll-server/wiki) for details
on what each configuration option means.

# Security
By default, the server is configured to run without security.  You can change this by
following instructions on [the wiki](https://github.com/digitalcatnip/remtroll-server/wiki).
