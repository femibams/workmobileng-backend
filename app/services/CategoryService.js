const MongoDBHelper = require('../lib/MongoDBHelper');
const categoryModel = require('../model/categoryModel');

class CategoryService {

    constructor(logger, mongoClient) {
        this.logger = logger;
        this.mongoDBClientHelper = new MongoDBHelper(categoryModel, mongoClient)
    }

    /**
     * 
     */
    create(data) {
        return this.mongoDBClientHelper.save(data);
    }
}

module.exports = CategoryService;