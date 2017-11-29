/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	authenticate: function(req, res) {
    var email = req.param('email');
    var password = req.param('password');

    if (!email || !password) {
      return res.json(200, {err: 'username and password required'});
    }

    User.findOneByEmail(email, function(err, user) {
      if (!user) {
        return res.json(200, {err: 'invalid username or password'});
      }

      User.validPassword(password, user, function(err, valid) {
        if (err) {
          return res.json(200, {err: 'forbidden'});
        }

        if (!valid) {
          return res.json(200, {err: 'invalid username or password'});
        } else {
          res.json({user: user, token: sailsTokenAuth.issueToken({sid: user.id})});
        }
      });
    })
  },

  register: function(req, res) {
    //TODO: Do some validation on the input
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (req.param('password') !== req.param('confirmPassword')) {
			return res.json({status: 2, text: 'Password doesn\'t match' });
    }
   	else if(!re.test(req.param('email') )  && req.param('email') ){
			return res.json({status: 2, text: 'Invalid email address!' });
		}
		else if(!req.param('username') ){
			return res.json({status: 2, text: 'Please provide your username' });
		}
		else{

			var gotImg = req.param('got_img');

			var data = {
				email: req.param('email'),
				password: req.param('password'),
				username: req.param('username'),
				first_name:  req.param('first_name'),
				last_name:  req.param('last_name'),
				contact:  req.param('contact'),
				status: 1
			};


			if(gotImg && gotImg == 1 ){

				var fs = require('fs');
				var path = require('path');
				var im = require('imagemagick');

				var ImagesDirArr = __dirname.split('/'); // path to this controller
	      ImagesDirArr.pop();
	      ImagesDirArr.pop();

				var upload_path =  ImagesDirArr.join('/')  + '/assets/images/users/';

				if(fs.existsSync( upload_path )){

	          console.log('folder exists');

						req.file('photo').upload(
							{
								dirname: '../public/images',
								maxBytes: 10000000
							},
							function (err, files) {

								if (err){
									sails.log(err);
									return res.json(err);
								}


								data['img_url'] = path.basename(files[0].fd);
								sails.log(data);

								var _src = files[0].fd;
	              var _dest =  upload_path + path.basename(files[0].fd); // the destination path

	              fs.createReadStream(_src).pipe(fs.createWriteStream(_dest));

	              im.resize({
	                srcPath: _src,
	                dstPath: upload_path + '300_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
	                width: 300
	              }, function(err, stdout, stderr){
	                if (err) throw err;
	                sails.log('resized fit within 300px');
	              });

								User.create(data).exec(function(err, user) {
									if (err) {
										res.json(200, {err: err});
										return;
									}
									if (user) {
										//res.json({user: user, token: sailsTokenAuth.issueToken({sid: user.id}), status: 1, text: 'successfully updated' } );

										 EmailService.sendEmail({
											 to: req.param('email'),
											 subject: 'Welcome to I-Post!',
											 text: "Hey " + req.param('first_name') + "\n Thanks for signing up, and welcome to I-Post!\n" ,
											 html: '<b>Hey '+ req.param('first_name') + '</b><br/> Thanks for signing up, and welcome to I-Post!<br/>'
										 }, function (err) {
										 });


										res.json({ status: 1, text: 'successfully updated' } );
									}
								});

						});


	        }
					else{

								var mkdirp = require('mkdirp');
		            mkdirp(upload_path , function(err) {
		              // path exists unless there was an error
		              if (err){
										sails.log(err);
										return res.json(err);
									}
		              else{

										req.file('photo').upload(
											{
												dirname: '../public/images',
												maxBytes: 10000000
											},
											function (err, files) {

												if (err){
													sails.log(err);
													return res.json(err);
												}


												data['img_url'] = path.basename(files[0].fd);

												sails.log(data);

												var _src = files[0].fd;
					              var _dest =  upload_path + path.basename(files[0].fd); // the destination path

					              fs.createReadStream(_src).pipe(fs.createWriteStream(_dest));

					              im.resize({
					                srcPath: _src,
					                dstPath: upload_path + '300_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
					                width: 300
					              }, function(err, stdout, stderr){
					                if (err) throw err;
					                sails.log('resized fit within 300px');
					              });

												User.create(data).exec(function(err, user) {
													if (err) {
														res.json(200, {err: err});
														return;
													}
													if (user) {
														//res.json({user: user, token: sailsTokenAuth.issueToken({sid: user.id}), status: 1, text: 'successfully updated' } );

														 EmailService.sendEmail({
															 to: req.param('email'),
															 subject: 'Welcome to I-Post!',
															 text: "Hey " + req.param('first_name') + "\n Thanks for signing up, and welcome to I-Post!\n" ,
															 html: '<b>Hey '+ req.param('first_name') + '</b><br/> Thanks for signing up, and welcome to I-Post!<br/>'
														 }, function (err) {
														 });


														res.json({ status: 1, text: 'successfully updated' } );
													}
												});

										});

									}

								});

					}


			}
			else{

				User.create(data).exec(function(err, user) {
					if (err) {
						res.json(200, {err: err});
						return;
					}
					if (user) {
						//res.json({user: user, token: sailsTokenAuth.issueToken({sid: user.id}), status: 1, text: 'successfully updated' } );

						 EmailService.sendEmail({
							 to: req.param('email'),
							 subject: 'Welcome to I-Post!',
							 text: "Hey " + req.param('first_name') + "\n Thanks for signing up, and welcome to I-Post!\n" ,
							 html: '<b>Hey '+ req.param('first_name') + '</b><br/> Thanks for signing up, and welcome to I-Post!<br/>'
						 }, function (err) {
						 });


						res.json({ status: 1, text: 'successfully updated' } );
					}
				});

			}


		}






  },

	forgetpassword: function(req, res) {
    var email = req.param('email');

    if (!email ) {
      return res.json({status: 2, text: 'email required'});
    }
		else{

			User.findOneByEmail(email, function(err, user) {

	      if (!user) {
	        return res.json({status: 2, text: 'invalid email'});
	      }
				else{

					var password = '';
					var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	 				for (var i = 9; i > 0; --i){
						password += chars[Math.floor(Math.random() * chars.length)];
					}

					var data = {
						password: password,
					}

					User.update({id: user.id }, data).exec(function afterwards(err, updated){
						if (err) return res.json(err);

						EmailService.sendEmail({
							 to: user.email,
							 subject: 'Reset password',
							 text: "Hello" + user.first_name + ",\n Your new password is : " + password +  "\nWe have reset your account password.\nThank you.\nI-Post Team." ,
							 html: '<b>Hello '+ user.first_name + '</b><br/>Your new password is : ' + password + '<br/>We have reset your account password.<br/>Thank you.<br/><b>I-Post Team</b>'
						 }, function (err) {
						 });

						var token = sailsTokenAuth.issueToken({sid: user.id});

						return res.json({ status: 1, text: 'password reset successfully' } );

					});


				}


	    });

		}


  },

};
