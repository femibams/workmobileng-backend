class JobController {
    /**
     * Class Constructor
     * @param logger - winston logger
     * @param jobService
     */
    constructor(logger, jobService){
        this.logger = logger;
        this.jobService = jobService;
    }

}

module.exports = JobController;