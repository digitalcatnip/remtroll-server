var os = require('os');
var exec = require('child_process').exec;
var config = require('./config.js').Config;

exports.RemTrollHandler = {
  getMacForIFace: function(iface) {
    var interfaces = os.networkInterfaces();
    var result = {
      mac: ''
    };
    for (var interface in interfaces) {
      if (interface.toLowerCase() == iface.toLowerCase()) {
        var elements = interfaces[interface];
        for (var i = 0; i < elements.length; i++) {
          data = elements[i];
          if (data.family.toLowerCase() === 'ipv4') {
            console.log('mac is ' + data.mac);
            result.mac = data.mac;
          }
        }
      }
    }

    return result;
  },
  getBody: function() {
    return '<html><body><h1>Hello!</h1></body></html>';
  },
  getPing: function() {
    return {
      ping: true
    };
  },
  shutdown: function(passphrase) {
    var actualPw = config.getConfigElement('shutphrase');
    if(actualPw != passphrase)
    {
      console.log('Invalid passphrase specified');
      return {result: false};
    }
    var osType = os.type();
    var puts = function(error, stdout, stderr) { console.log(stdout) };
    if(osType == 'Linux' || osType == 'Darwin')
    {
      exec("sudo shutdown -h now", puts);
    }
    else if(osType =='Windows_NT')
    {
      //Are we windows?
      exec("shutdown /s", puts);
    }

    return {result: true};
  },
};
