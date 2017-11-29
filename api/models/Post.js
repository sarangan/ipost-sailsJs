/**
 * Post.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */


 module.exports = {
   autoPK: false,
   attributes: {

     post_id: {
       type: "integer",
       primaryKey: true,
     },
     user_id:{
       type: "integer",
       required: true
     },
     body: {
       type: "string"
     },
     type: {
       type: "integer" // 1 text 2 image 3 location
     },
     mb_createdAt: {
       type: "string"
     }
   }
 };
