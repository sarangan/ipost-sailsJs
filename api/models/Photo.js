/**
 * photos.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: false,
  attributes: {

    photo_id: {
      type: "integer",
      primaryKey: true,
    },
    post_id:{
      type: "integer",
      required: true
    },
    img_url: {
      type: "string"
    }
  }
};
