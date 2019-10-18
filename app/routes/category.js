/**
 * Created by Femibams on 13/10/2019
 */

module.exports.setup = (server, serviceLocator) => {
    const categoryController = serviceLocator.get('categoryController');

    server.get({
        name: 'Create a category',
        path: '/category/create'
    }, (req, res) => categoryController.create(req, res));
}