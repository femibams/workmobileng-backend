/**
 * Created by Fembams on 14/10/19
 */
const Response = require("../lib/response_manager");
const HttpStatus = require("../constants/httpStatus");

class CategoryController {
    
    constructor(logger, categoryService) {
        this.logger = logger;
        this.service = categoryService;
    }

    /**
     * 
     */
    create(req, res) {
        const { name, desc } = req.body;

        if(!name)
            return Response.failure(res, { message: 'Name field is required'}, HttpStatus.BadRequest)

        const categoryData = { name, desc }

        return this.service.create(categoryData)
            .then(() => {
                return Response.success(res, {
                    message: 'Category created successfully'
                }, HttpStatus.CREATED)
            })
            .catch((error) => {
                this.logger.error(`An error occured whle tryng to save category data -- ${error}`);

                return Response.failure(res, {
                    message: 'Something went wrong',
                    response: 'Category data did not save'
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            });
    }
}

module.exports = CategoryController;