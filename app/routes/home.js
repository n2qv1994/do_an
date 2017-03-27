var express    = require('express');
var user_model = require('../models/user_model');
var config     = require('../../config/config.js');
var router  = express.Router();


router.get('/', function(req, res, next) {
  res.render('home', { data: {
                          title: "BK Media | Home",
                          page: 'home',
                          message: "N2qv",
                          host: config.HOST,
                          user: req.session.user.data,
                        }
                      });
});

module.exports = router;
