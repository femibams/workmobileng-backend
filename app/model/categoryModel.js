/**
 * Created by Femibams
 */

const mongoose = require('mongoose');
const config = require('../config/config');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    desc: String
  },
  {
    timestamps: true
  }
);


const categoryModel = mongoose.model(config.mongo.collections.category, categorySchema);

module.exports = categoryModel;
