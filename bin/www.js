var app = require('../app/app.js');
var config = require("../config/config.js");

console.log("Starting PeerCDN for Video version:" + config.version);

app.init(config);
