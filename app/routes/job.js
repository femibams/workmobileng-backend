/**
 * Created by Femibams on 23/09/2019
 */

 module.exports.setup = function setup(server, serviceLocator){
    const jobController = serviceLocator.get('jobController');

    server.post(
      {
        path: "/job/create",
        name: "Create a job",
        version: "1.0.0"
      },
      (req, res) => jobController.createJob(req, res)
    );

    server.get(
      {
        path: "/job/find",
        name: "Find a job",
        version: "1.0.0"
      },
      (req, res) => jobController.findJob(req, res)
    );
 }