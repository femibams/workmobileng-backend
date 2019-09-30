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

    saveJob(data){
        return this.mongoClientHelper.save(data)
    }

    findJob(params){
        let searchParams = {}
        searchParams.limit = 10;
        if(params.page){
            searchParams.skip = params.page;
        }
        if(params.size){
            searchParams.limit = params.size
        }

        delete params.page
        delete params.size
        
        searchParams.conditions = params;
        searchParams.populate = ['projectOwner']

        return this.mongoClientHelper.get(searchParams)
    }
}

module.exports = JobService