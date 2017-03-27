var express = require("express");
var bodyParser   = require('body-parser');
var path         = require('path');
var methodOverride = require('method-override');
var session = require('express-session');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var PeerServer = require('peer').PeerServer;

var RoomManager = require('./peer-cdn/room-manager.js');
var api         = require('./api/api.js');
var login       = require("./routes/login.js");
var home       = require("./routes/home.js");
var user_services = require("./services/user_services.js");
var list_user = {};

var peer_server = null;
var config = {};
var room_mapper = {};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, room_code");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});
app.use(session({
  secret: "n2qv",
  resave: true,
  saveUninitialized: true
}));
// override with POST having ?_method=PUT
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/routes')));
app.use(express.static(path.join(__dirname, '/views')));
app.use('/api', api);
app.use("/", login);
app.use("/home", home);

function getRoom(room_id){
    if(!room_mapper.hasOwnProperty(room_id)){
        room_mapper[room_id] = RoomManager.create(room_id, config);
    }
    return room_mapper[room_id];
}

io.on('connection', function(socket){
  console.log("On Connection:", socket.id, socket.handshake.query);
  var room_id = socket.handshake.query.room_id;
  var key = socket.handshake.query.key;
  // if(room_id != undefined && room_id.length > 0){
  //     getRoom(room_id).addPeer(socket.id, socket);
  // } 
  // else {
  //     socket.close();
  // }
  socket.on("disconnect", function() {
    user_services.update_status(socket.username,"offline");
    delete list_user[socket.username];

    // for(var room_id in room_mapper) {
    //   room_mapper[room_id].update_list_user(list_user);
    // }
  }); 
  socket.on("info", function(info) {
    socket.username = info.username;
    list_user[info.username] = {
      peer_id : socket.id,
      username: info.username,
      hostname : info.hostname,
      city : info.city,
      region : info.region,
      country : info.country,
      location : info.location,
      origin : info.origin,
    }
    if(room_id != undefined && room_id.length > 0){
      getRoom(room_id).addPeer(socket.id, info.username, info.origin, socket);
    } 
    else {
        socket.close();
    }
    user_services.update_status(info.username,"online");
    // for(var room_id in room_mapper) {
    //   room_mapper[room_id].update_list_user(list_user);
    // }
  });
  socket.on("increase_point", function(peer_id) {
    for(var username in list_user) {
      if(list_user[username].peer_id == peer_id) {
        user_services.update_point(list_user[username].username);
        return;
      }
    }
  }); 
});

module.exports = {
  init: function(_config){
      config = _config;
      peer_server = PeerServer({port: config.peer_port, path: '/peerserver'});
      server.listen(config.cdn_port);
      console.log("Starting PeerServer in port" + config.peer_port);
      console.log("Starting PeerCDNServer in port " + config.cdn_port);
  }
};