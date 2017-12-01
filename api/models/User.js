/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt = require('bcrypt');

module.exports = {

  schema: true,
  autoPK: false,

  attributes: {
    id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    encryptedPassword: {
      type: 'string'
    },
    img_url: {
      type: 'string',
    },
    first_name: {
      type: 'string'
    },
    last_name: {
      type: 'string'
    },
    contact: {
      type: 'string'
    },
    username: {
      type: 'string'
    },
    status: {
      type: 'integer',
      defaultsTo: 1
    },
    temppassword:{
      type: 'string'
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.encryptedPassword;
      return obj;
    }
  },

  beforeCreate: function(values, next) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(values.password, salt, function(err, hash) {
        if (err) return next(err);

        values.encryptedPassword = hash;
        next();
      });
    });
  },

  beforeUpdate: function(values, next) {
    bcrypt.genSalt(10, function(err, salt) {
      sails.log(err);
      if (err) return next(err);

      bcrypt.hash(values.password, salt, function(err, hash) {
        if (err) return next(err);

        values.encryptedPassword = hash;
        next();
      });
    });
  },

  validPassword: function(password, user, cb) {
    bcrypt.compare(password, user.encryptedPassword, function(err, match) {
      if (err) cb(err);

      if (match) {
        cb(null, true);
      } else {
        cb(err);
      }
    });
  }
};
