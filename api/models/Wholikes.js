/**
 * wholikes.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {
    like_id:{
      type: "integer",
      primaryKey: true,
    },
    user_id: {
      type: "integer",
    },
    post_id:{
      type: "integer",
      required: true
    },
    status: {
      type: "integer",
    }
  }
};
