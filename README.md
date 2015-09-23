# RemTroll Server
RemTroll is a lightweight Node.js HTTP server that acts as a connection point
for the RemTroll mobile app.

It is developed by [Digital Catnip](http://www.catnip.io).

# Configuration
RemTroll places a config file in your specified location when you install the
server.  The config file must be in JSON format, or things will break. The
configuration options are as follows:

0. port - The port this server should listen on.
0. secure - If you set this to true, https will be used.
0. privkey - If you set secure to true, use this to specify the location of your private key file.
0. pubcert - If you set secure to true, use this to specify the location of your public key file.
0. keypass - If you have a password for the private key, you can specify it here.
0. cacert - If you set secure to true, use this to specify the location of your certificate authority certificate.  If you're using a certificate signed by an already-trusted authority, leave this blank.
0. shutphrase - This acts like a password that you can use to control who can give the shutdown command.  The app will prompt you for this.  It defaults to 'supersecret'.

# Security
If you wish, you can configure https to work with RemTroll.  The server will
require you to configure the private key and public key for HTTPS.

If you own a domain, we've used [CACert.org](http://www.cacert.org) to create
certificates for free in the past.  The downside is that not all browsers and
OSes/devices trust CACert so you may need to install their root certificate.

Once you've created the certificate, you'll need to install it on your
phone/tablet.  The 5 tips link below gives you some tips for iOS.  For Android,
we'll get back to you.

* [Circle Engineering](http://engineering.circle.com/https-authorized-certs-with-node-js/) -
follow the steps here to create a server certificate (just the first section labeled "from scratch".
* [5 tips on creating SSL certificates](https://blog.httpwatch.com/2013/12/12/five-tips-for-using-self-signed-ssl-certificates-with-ios/)
Lessons learned and an easy way to get your certificate on your iPhone or iPad.

If you'd like to remove the password on your RSA private key for the certificate,
you can follow [this site](https://mnx.io/blog/removing-a-passphrase-from-an-ssl-key/).
