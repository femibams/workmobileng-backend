/**
 * Created by Femibams on 23/09/219
 */

const mongoose = require('mongoose');
const config = require('../config/config');

const jobSchema = new mongoose.Schema({
    user: { 
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
    budget: '',
    status: {
        type: String,
        enum: []
    },
    rating
});