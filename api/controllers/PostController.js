/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	posttext : function(req, res){


		if( req.token.hasOwnProperty('sid') ){
			if(req.token.sid){

				User.findOne({id :  req.token.sid}).exec(function(err, user){
					if(err) return res.json(err);

					if(user){

						sails.log('body');
						sails.log(req.param('body') );

						if (!req.param('body') ) {
							sails.log('no body');
							return res.json({status: 2, text: 'Please provide the text body' });
				    }
						else{
							sails.log('yes body');
							var type = req.param('type');

							var data = {
								user_id: user.id,
								body: req.param('body'),
								type: type,
							};

							sails.log(type);

							if(type && type == 2 ){



								var fs = require('fs');
								var path = require('path');
								var im = require('imagemagick');

								var ImagesDirArr = __dirname.split('/'); // path to this controller
					      ImagesDirArr.pop();
					      ImagesDirArr.pop();

								var upload_path =  ImagesDirArr.join('/')  + '/assets/images/posts/';

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


												var img_url = path.basename(files[0].fd);

												var _src = files[0].fd;
					              var _dest =  upload_path + path.basename(files[0].fd); // the destination path

					              fs.createReadStream(_src).pipe(fs.createWriteStream(_dest));

					              im.resize({
					                srcPath: _src,
					                dstPath: upload_path + '600_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
					                width: 600
					              }, function(err, stdout, stderr){
					                if (err) throw err;
					                sails.log('resized fit within 600px');
					              });

												Post.create(data).exec(function(err, post) {
													if (err) {
														res.json(200, {err: err});
														return;
													}
													if (post.post_id) {
														//res.json({user: user, token: sailsTokenAuth.issueToken({sid: user.id}), status: 1, text: 'successfully updated' } );

														var data_post = {
															post_id: post.post_id,
															img_url: img_url
														};

														Photo.create(data_post).exec(function(err, photo_res) {
															if (err) {
																res.json(200, {err: err});
																return;
															}

															res.json({ status: 1, text: 'successfully posted' } );

														});



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

																var img_url = path.basename(files[0].fd);

																sails.log(data);

																var _src = files[0].fd;
									              var _dest =  upload_path + path.basename(files[0].fd); // the destination path

									              fs.createReadStream(_src).pipe(fs.createWriteStream(_dest));

									              im.resize({
									                srcPath: _src,
									                dstPath: upload_path + '600_' + path.basename(files[0].fd, path.extname(files[0].fd) ) + '.jpg',
									                width: 600
									              }, function(err, stdout, stderr){
									                if (err) throw err;
									                sails.log('resized fit within 600px');
									              });


																Post.create(data).exec(function(err, post) {
																	if (err) {
																		res.json(200, {err: err});
																		return;
																	}
																	if (post.post_id) {
																		//res.json({user: user, token: sailsTokenAuth.issueToken({sid: user.id}), status: 1, text: 'successfully updated' } );

																		var data_post = {
																			post_id: post.post_id,
																			img_url: img_url
																		};

																		Photo.create(data_post).exec(function(err, photo_res) {
																			if (err) {
																				res.json(200, {err: err});
																				return;
																			}

																			res.json({ status: 1, text: 'successfully posted' } );

																		});



																	}
																});



														});

													}

												});

									}


							}
							else{
								// just post the text
								sails.log('no image save');
								sails.log(data);
								Post.create(data).exec(function(err, post) {
									if (err) {
										res.json(200, {err: err});
										return;
									}
									sails.log(post);
									if (post.post_id) {
										res.json({ status: 1, text: 'successfully posted' } );
									}
								});


							}




						}

					}


				});

			}

		}


	},

	getposts: function(req, res) {

		User.findOne({id :  req.token.sid}).exec(function(err, user){
			if(err) return res.json(err);

			if(user){

				var page = req.param('page') || 1;

				Post.query("select post.post_id, post.user_id, post.body, post.type, DATE_FORMAT(post.createdAt,'%d/%m/%Y') as postdate, photo.img_url, (select count(wholikes.like_id) from wholikes where wholikes.post_id = post.post_id and wholikes.user_id = "+ user.id +" and wholikes.status = 1 ) as ilike, (select count(wholikes.like_id) from wholikes where wholikes.post_id = post.post_id ) as count_likes, (select count(comment.comment_id) from comment where comment.post_id = post.post_id ) as count_comments from post left join photo on post.post_id =  photo.post_id order by post.createdAt DESC limit "+ (page-1) * 30 +", 30", function(err, posts){

					if(err) return res.json(error: err, status: 2);

					return res.json(posts: posts, status: 1);

				});

			}

		});

	},


};
