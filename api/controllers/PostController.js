/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	closed : function(req, res){

		console.log(req.token);
		User.findOne(req.token.sid).exec(function(err, message) {
	    // Work with the user here

				res.json(message);
	  });

		//res.send({status: 'ok'});
	},

	opened : function(req, res){

		res.ok("opened function");
	}


};
