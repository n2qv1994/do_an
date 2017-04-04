var user_services = require("../services/user_service.js");
var jwt           = require('jsonwebtoken');
var config        = require('../../config/config.js');

exports.authenticate = function(req, res) {
	var user_info = {}
	user_info.username = req.body.username || "";
	user_info.password = req.body.password || "";
	if(user_info.username === "" || user_info.password === "") {
		var err = "username or password are not valid";
		return res.status(401).json({
			error: {
				data: err
			},
			status_code: 401
		});
	}

	user_services.login(user_info, function(error, result) {
		if(error) {
			return res.status(result.status_code).json({
				"error": {
					"data": result.data
				},
				"status_code": result.status_code
			});
		}

		// var token = jwt.sign(result.data, config.secret, {
  //     		expiresIn: 86400 // expires in 24 hours
  //  		 });

		return res.status(result.status_code).json({
			"success": {
				"data": result.data,
				// "token": token
			},
			"status_code": result.status_code
		});
	});
};