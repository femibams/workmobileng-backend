/**
 * Created by Eshemogie Kassim(Jnr) on 10/10/2018.

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
    (req, res) => res.send("Welcome to the Global Auth Service")
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
      path: "/users/all",
      name: "get all users without pagination",
      version: "1.0.0"
    },
    (req, res) => AuthController.getAllUsersNoPagination(req, res)
  );


  server.get(
    {
      path: "/users/:userId",
      name: "get all users by userid",
      version: "1.0.0"
    },
    (req, res) => AuthController.getByUserId(req, res)
  );

  server.get(
    {
      path: "/role/:userId",
      name: "get user role by userid",
      version: "1.0.0"
    },
    (req, res) => AuthController.getUserRole(req, res)
  );

  server.get(
    {
      path: "/allUsers/:superAdminId",
      name: "get all users created by a superAdmin",
      version: "1.0.0"
    },
    (req, res) => AuthController.getAllUsersCreatedBySuperAdmin(req, res)
  );

  server.del(
    {
      path: "/delete_user/:userId",
      name: "delete a user by id",
      version: "1.0.0"
    },
    (req, res) => AuthController.deleteByUserId(req, res)
  );

  server.put(
    {
      path: "/updateUserRole/:userId",
      name: "update user profile", //update user role based on User Id
      version: "1.0.0"
    },
    (req, res) => AuthController.updateUserRole(req, res)
  );
};
