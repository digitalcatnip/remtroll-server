# RemTroll Server
RemTroll is a lightweight Node.js HTTP server that acts as a connection point
for the RemTroll mobile app.

It is developed by [Digital Catnip](http://www.catnip.io).

# Installation
To install from the command line, run:

`npm install remtroll-server -g`

You will then be able to run remtroll-server by doing the following:

`remtroll-server <config path>`

where config path is the path to your configuration file.  This is optional as you can edit the configuration file in the module directory where remtroll-server is installed.

# Configuration
See [the wiki](https://github.com/digitalcatnip/remtroll-server/wiki) for instructions
on how to configure the server.

# Security
By default, the server is configured to run without security.  You can change this by
following instructions on [the wiki](https://github.com/digitalcatnip/remtroll-server/wiki).
