/**
 * Created by Eshemogie Kassim(Jnr)
 */

const mongoose = require('mongoose');
const config = require('../config/config');

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true
    },
    msisdn: String,
    firstname: String,
    lastname: String,
    password: String,
    userId: {
      type: String,
      unique: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    username: {
      type: String,
      unique: true
    },
    code: String
  },
  {
    timestamps: true
  }
);


const authModel = mongoose.model(config.mongo.collections.users, authSchema);
module.exports = authModel;

