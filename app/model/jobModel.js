/**
 * Created by Femibams on 23/09/219
 */

const mongoose = require('mongoose');
const config = require('../config/config');
const FKHelper = require('../lib/helper');
const Schema = mongoose.Schema;

const jobSchema = new mongoose.Schema({
    projectOwner: {
        type: Schema.ObjectId,
        ref: 'users',
        validate: {
			isAsync: true,
			validator: function(v) {
				return FKHelper(mongoose.model('users'), v);
			},
			message: `User doesn't exist`
		}
    },
    title: String,
    description: String,
    duration: Number,
    skills: [{
        type: Schema.ObjectId, 
        ref: 'skills'
    }],
    lowerLimitBudget: Number,
    upperLimitBudget: Number,
    status: {
        type: String,
        enum: []
    },
    rating: Number
});

const jobModel = mongoose.model(config.mongo.collections.job, jobSchema);
module.exports = jobModel;
