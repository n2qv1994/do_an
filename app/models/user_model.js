var request    = require('request');
var moment     = require('moment');
var config     = require('../../config/config');

exports.login = function(req, res, next) {
  var username = req.body.username || '';
  var password = req.body.password || '';

  if(username === '' || password === '') {
    res.render('login', { data: {
                            title: "BK Media",
                            message: "Username or Password is not valid!",
                            host: config.HOST,
                            user: {
                              username: req.body.username,
                              password: req.body.password
                            }
                          }
                        });
  }

  var options = {
    url: config.authenticate,
    headers: {
      'Content-Type': 'application/json'
    },
    form: {
      username: username,
      password: password
    }
  };
  request.post(options, function(err, response, body) {
    if(!err && response.statusCode == 200) {
      req.session.user = JSON.parse(body).success;
      res.redirect('/home');
    }
    else {
      res.render('login', { data: {
                              title: "BK Media",
                              message: "Invalid credentials!",
                              host: config.HOST,
                              user: {
                                username: req.body.username,
                                password: req.body.password
                              }
                            }
                          });
    }
  });
};
