var fs = require('fs');
var cfg = {};
var isValid = false;
var defaults = {};

exports.Config = {
  initialize : function() {
    cfg = {};
    isValid = false;
    defaults = {
      'port'        : 3000,
      'secure'      : false,
      'shutphrase'  : 'supersecret'
    };
  },
  readConfig : function (filename) {
    var data = fs.readFileSync(filename);
    try
    {
      cfg = JSON.parse(data);
      console.log('Config file has been read.');
      this.validateConfig();
    }
    catch (err)
    {
      isValid = false;
      console.log('There has been an error parsing the config.')
      console.log(err);
    }
  },
  getDefaultForElement : function (element) {
    if( element in defaults)
      return defaults[element];
    else
      return false;
  },
  getConfigElement : function (element) {
    if( element in cfg )
      return cfg[element];
    else
      return this.getDefaultForElement(element);
  },
  validateConfig : function() {
    isValid = true;
    if(this.getConfigElement('secure'))
    {
      if(this.getConfigElement('privkey') === false)
      {
        console.log('You must specify a private key if you want to use https!');
        isValid = false;
      }

      if(this.getConfigElement('pubcert') === false)
      {
        console.log('You must specify a public key if you want to use https!');
        isValid = false;
      }
    }
  },
  isConfigValid : function () {
    return isValid;
  }
};
