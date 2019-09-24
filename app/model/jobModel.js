/**
 * Created by Femibams on 23/09/219
 */

const mongoose = require('mongoose');
const config = require('../config/config');

const jobSchema = new mongoose.Schema({
    projectOwner: {
        type: Schema.Types.ObjectId,
        ref: 'users' 
    },
    title: String,
    description: String,
    duration: Number,
    skills: [{
        type: Schema.Types.ObjectId, 
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
