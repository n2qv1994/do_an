var express    = require('express');
var user_model = require('../models/user_model');
var config     = require('../../config/config.js');
var router  = express.Router();

// router.get('/login', function(req, res, next) {
  // if(req.session.user) {
  //   res.redirect('/');     //If session exists, proceed to page
  // }
  // else {
//     res.render('login', { data: {
//                             title: "Peer BK | Login",
//                             page: 'login',
//                             message: "N2qv",
//                             host: config.HOST,
//                             user: {
//                               username: "",
//                               password: ""
//                             }
//                           }
//                         });
//   // }
// });

router.post('/login', user_model.login);

router.get('/', function(req, res, next) {
  res.render('home', { data: {
                            title: "Peer BK | Home",
                            page: 'home',
                            message: "N2qv",
                            host: config.HOST,
                          }
                        });;
});

router.get('/home', function(req, res, next) {
  res.render('home', { data: {
                          title: "Peer BK | Home",
                          page: 'home',
                          message: "N2qv",
                          host: config.HOST,
                        }
                      });
});

router.get('/room', function(req, res, next) {
  res.render('room', { data: {
                          title: "Peer BK | Room",
                          page: 'Room ',
                          message: "N2qv",
                          host: config.HOST,
                          user: req.session.user.data,
                          room_name: req.session.user.room_name,
                          room_link: req.session.user.room_link,
                        }
                      });
});

// function check_login(req, res, next) {
//   if(req.session.user) {
//     next();     //If session exists, proceed to page
//   }
//   else {
//     res.redirect('/login');
//   }
// }
module.exports = router;
