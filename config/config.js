var config = {};

config.version = "1.0.0";
config.cdn_port = 3005;
config.peer_host = "localhost";
config.peer_path = "/peerserver";
config.peer_port = 3006;
config.max_peer = 10;
config.min_peer = 7;
config.timeout_peer = 500;
config.secret = "n2qv1994";
config.HOST = "http://localhost:3005/";
config.authenticate = "http://localhost:3005/api/authenticate";
module.exports = config;
