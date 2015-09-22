var os = require('os');
var sys = require('sys')
var exec = require('child_process').exec;

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
  shutdown: function() {
    var osType = os.type();
    if(osType == 'Linux' || osType == 'Darwin')
    {
      var puts = function(error, stdout, stderr) { console.log(stdout) };
      exec("shutdown -h now", puts);
    }
    else {
      //Are we windows?
    }

    return {result: true};
  },
};
