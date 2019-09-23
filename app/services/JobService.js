const MongoDBHelper = require("../lib/MongoDBHelper");
const JobModel = require("../model/jobModel");

class JobService {
    /**
     * The constructor
     *
     * @param logger
     * @param mongoclient
     **/
    constructor(logger, mongoClient){
        this.logger = logger;
        this.mongoClientHelper = new MongoDBHelper(mongoClient, JobModel)
    }
}

module.exports = JobService