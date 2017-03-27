var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken');
var config = require('../../config/config');
var user_controller     = require('../controllers/user_controller');

// API User
router.post('/authenticate', user_controller.authenticate);

function ensure_authorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
      var bearer = bearerHeader.split(" ");
      bearerToken = bearer[1];
      req.token = bearerToken;
      jwt.verify(req.token, config.secret, function(err, decoded) {
        if (err) {
          return res.status(403).json({
            error: {
              data: 'Failed to authenticate token.'
            },
            status_code: 403
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(403).json({
        error: {
          data: "Invalid token"
        },
        status_code: 403
      });
    }
}

module.exports = router;
