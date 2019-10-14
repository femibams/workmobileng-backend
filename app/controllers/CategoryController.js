class CategoryController {
    
    constructor(logger, categoryService) {
        this.logger = logger;
        this.service = categoryService;
    }
}

module.exports = CategoryController;