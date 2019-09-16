/**
 * Created by Eshemogie Kassim(Jnr)
 */

const mongoose = require('mongoose');
const config = require('../config/config');

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String
    },
    msisdn: String,
    firstname: String,
    lastname: String,
    password: String,
    userId: {
      type: String,
      unique: true
    },
    privilege: {
      type: String,
      default: 'user',
    },
    verified: {
      type: Boolean,
      default: false
    },
    username: {
      type: String,
      unique: true
    },
    app_name: String,
    company_size: Number,
    company_name: String,
    code: String
  },
  {
    timestamps: true
  }
);


const authModel = mongoose.model(config.mongo.collections.users, authSchema);
module.exports = authModel;

