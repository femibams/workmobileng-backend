/**
 * Created by Femibams on 23/09/2018.

 */
//const PartnerAuthentication = require('../lib/middleware');
module.exports.setup = function setup(server, serviceLocator) {
  const AuthController = serviceLocator.get("authController");

  server.get(
    {
      path: "/",
      name: "app health check",
      version: "1.0.0"
    },
    (req, res) => res.send("Welcome to the Backend Service for Workmobile")
  );

  server.post(
    {
      path: "/login",
      name: "Login a user ",
      version: "1.0.0"
    },
    (req, res) => AuthController.logUserIn(req, res)
  );

  server.post(
    {
      path: "/signup",
      name: "Create a new user",
      version: "1.0.0"
    },
    (req, res) => AuthController.registerNewUser(req, res)
  );

  server.post(
    {
      path: "/createAdminUser",
      name: "Create a new super admin user",
      version: "1.0.0"
    },
    (req, res) => AuthController.createSuperAdminUser(req, res)
  );

  server.post(
    {
      path: "/send_code",
      name: "Create code to be sent to users mail ",
      version: "1.0.0"
    },
    (req, res) => AuthController.sendEmailAndCode(req, res)
  );

  server.post(
    {
      path: "/verify_email",
      name: "Verify User email",
      version: "1.0.0"
    },
    (req, res) => AuthController.verifyUserEmail(req, res)
  );

  server.put(
    {
      path: "/reset_password",
      name: "reset user password",
      version: "1.0.0"
    },
    (req, res) => AuthController.resetPassword(req, res)
  );

  server.get(
    {
      path: "/users",
      name: "get all users",
      version: "1.0.0"
    },
    (req, res) => AuthController.getAllUsers(req, res)
  );

  server.get(
    {
      path: "/user/:userId",
      name: "get a user by userid",
      version: "1.0.0"
    },
    (req, res) => AuthController.getByUserId(req, res)
  );

};
