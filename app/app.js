var express = require("express");
var bodyParser   = require('body-parser');
var path         = require('path');
var methodOverride = require('method-override');
var session = require('express-session');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var PeerServer = require('peer').PeerServer;
var Utils           = require("./utils/utils");

var RoomManager = require('./peer-cdn/room-manager.js');
var api         = require('./api/api.js');
// var login       = require("./routes/login.js");
// var home       = require("./routes/home.js");
var routes       = require("./routes/routes.js");

var location_helper = require("./helpers/location_helper.js");
var user_helper = require("./helpers/user_helper.js");

var user_service = require("./services/user_service.js");
var location_service = require("./services/location_service.js");
var zone_service = require("./services/zone_service.js");
var user_zone_service = require("./services/user_zone_service.js");
var friend_service = require("./services/friend_service.js");

var score_job = require("./jobs/score_job.js");
var zone_job = require("./jobs/zone_job.js");
var status_job = require("./jobs/status_job.js");
var location_job = require("./jobs/location_job.js");
var user_zone_job = require("./jobs/user_zone_job.js");
var friend_job = require("./jobs/friend_job.js");

var list_user = {};

var peer_server = null;
var config = {};
var room_mapper = {};

var kue = require('kue');
// app.use(kue.app);
global.queue = kue.createQueue({
  prefix: 'q',
  redis: {
    port: 6379,
    host: '0.0.0.0',
    db: 3, // if provided select a non-default redis db
    options: {
      // see https://github.com/mranney/node_redis#rediscreateclient
    }
  }
});
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
app.use(express.static(path.join(__dirname, '/node_modules')));
app.use(express.static(path.join(__dirname, '/routes')));
app.use(express.static(path.join(__dirname, '/views')));
app.use('/api', api);
// app.use("/", login);
// app.use("/home", home);
app.use("/", routes);

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
  zone_job.add_zone(room_id);
  // if(room_id != undefined && room_id.length > 0){
  //     getRoom(room_id).addPeer(socket.id, socket);
  // } 
  // else {
  //     socket.close();
  // }
  socket.on("disconnect", function() {
    // user_helper.update_status(socket.user,"offline");
    // friend_service.update_status(socket.user,"offline");
    status_job.update_status(socket.user,"offline");
    friend_job.upgrade_to_friend(socket.user);
    delete list_user[socket.id];
  }); 

  socket.on("info", function(info) {
    socket.username = info.username;
    user_helper.find_by_username(info.username)
    .then(function(message) {
      var user = message.data;
      socket.user = user;
      list_user[socket.id] = {
        username: info.username,
        user_id :user.id,
        socket_id: socket.id
      };

      if(room_id != undefined && room_id.length > 0){
        getRoom(room_id).addPeer(socket.id, user.id, info.origin, info.longitude, info.latitude, socket);
      } 
      else {
          socket.close();
      }

      // user_helper.update_status(user,"online");
      // friend_service.update_status(user,"online");
      // location_service.add_location(user, info);
      // user_zone_service.add_relation(user, room_id);

      status_job.update_status(user,"online");
      location_job.add_location(user, info);
      user_zone_job.add_relation(user, room_id);

    })
    .catch(function(message_error) {
      console.log("*** Find username false ***");
      console.log(message_error);
    });
  });

  socket.on("increase_score", function(data) {
    if(data.type == "peer") {
      zone_job.update_peer_zone(data.room_name);
      for(var socket_id in list_user) {
        if(list_user[socket_id].socket_id == data.sender_id) {
          var sender_id = list_user[socket_id].user_id;
          score_job.update_user_score(list_user[socket_id].username);
          for(var socket_id in list_user) {
            if(list_user[socket_id].username == data.receiver) {
              score_job.update_friend_score(list_user[socket_id].user_id, sender_id);
              return;
            }
          }   
          return;
        }
      }
    }
    if(data.type == "http") {
      zone_job.update_http_zone(data.room_name);
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