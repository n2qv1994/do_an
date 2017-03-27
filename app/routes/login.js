var express    = require('express');
var user_model = require('../models/user_model');
var config     = require('../../config/config.js');
var router  = express.Router();


router.get('/', function(req, res, next) {
  // if(req.session.user) {
  //   res.redirect('/');     //If session exists, proceed to page
  // }
  // else {
    res.render('login', { data: {
                            title: "BK Media | Login",
                            page: 'login',
                            message: "N2qv",
                            host: config.HOST,
                            user: {
                              username: "",
                              password: ""
                            }
                          }
                        });
  // }
});

router.post('/login', user_model.login);

// function check_login(req, res, next) {
//   if(req.session.user) {
//     next();     //If session exists, proceed to page
//   }
//   else {
//     res.redirect('/login');
//   }
// }

module.exports = router;
