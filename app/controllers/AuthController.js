/**
 * Created by femibams on 16/09/2019.
 */

const base64 = require("base-64");
const Response = require("../lib/response_manager");
const HttpStatus = require("../constants/httpStatus");
const auth = require("basic-auth");
const uuid = require("uuid/v4");
const bcrypt = null;
const crypto = require('crypto');
const SendMail = require("./MailController");
const config = require("../config/config");

class AuthController {
  /**
   * Class Constructor
   * @param logger - winston logger
   * @param authService
   */
  constructor(logger, authService) {
    this.logger = logger;
    this.authService = authService;
  }

  /**
   * this method simply logs users in.
   * @param req
   * @param res
   * @methodVerb POST
   */
  logUserIn(req, res) {
    this.logger.info("login in user");
    
    const user = req.body;

    const { email, password } = user;

    // check if required parameters are passed
    if (!password || !email) {
      return Response.failure(
        res,
        { message: "Error!! pls provide password, Email" },
        HttpStatus.BadRequest
      );
    }

    return this.authService
      .getOne({ email })
      .then(data => {
        if (data === null) {
          return Response.failure(
            res,
            {
              message: "Invalid Email"
            },
            HttpStatus.BadRequest
          );
        }
        const hash = data.password;
        const inputPassword = password;

        if (this.comparePass(inputPassword, hash)) {
          return Response.success(
            res,
            {
              message: "User successfully logged in",
              response: {
                data
              }
            },
            HttpStatus.OK
          );
        } else {
          return Response.failure(
            res,
            {
              message: "Invalid password"
            },
            HttpStatus.BadRequest
          );
        }
      })
      .catch((error) => {
        console.log('An error occured', error);
        return Response.failure(
          res,
          {
            message: "Something went wrong"
          },
          HttpStatus.BadRequest
        );
      });
  }

  comparePass(input, hash){
    const hashedInput = crypto.scryptSync(input, 'salt', 64);
    const hashedInputValue = hashedInput.toString('hex');

    return (hashedInputValue == hash ? true : false)
  }

  /**
   * this method registers new users
   *
   * @param req
   * @param res
   * @methodVerb POST
   */
  registerNewUser(req, res) {
    this.logger.info("register new user");

    // const Authentication = req.header("Authentication", ["Authentication"]);
    // // check if Authentication header was sent
    // if (Authentication[0] === "Authentication") {
    //   return Response.failure(
    //     res,
    //     {
    //       message: "Bad Authentication"
    //     },
    //     HttpStatus.UNAUTHORIZED
    //   );
    // }

    // const decryptedAppName = this.decryptAppname(Authentication);
    // console.log(decryptedAppName, "app_name");

    // check if all required parameters were passed
    const { password, email } = req.body;
    if (!password || !email || !username) {
      return Response.failure(
        res,
        { message: "Error!! pls provide password, Email, username fields" },
        HttpStatus.BadRequest
      );
    }

    let firstname;
    let lastname;
    let msisdn;
    let username;

    if (req.body.firstname) {
      firstname = req.body.firstname;
    }

    if (req.body.lastname) {
      lastname = req.body.lastname;
    }

    if (req.body.msisdn) {
      msisdn = req.body.msisdn;
    }

    if (req.body.username) {
      username = req.body.username;
    }
    const hashedPassword = this.hashPassword(password);
    const params = {
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      msisdn,
      userId: uuid()
    };

    return this.authService
      .checkForEmail(email)
      .then(resp => {
        if (resp !== null) {
          return Response.failure(res,
            {
              message: "email already exist"
            },
            HttpStatus.BadRequest
          );
        }
        return this.authService
          .saveNewUsers(params)
          .then(data => {
            return Response.success(
              res,
              {
                message: "user created successfully",
                response: {
                  userId: data.userId,
                  verified: data.verified
                }
              },
              HttpStatus.CREATED
            );
          })
          .catch(err => {
            let formattedError = err.msg;
            formattedError = JSON.stringify(formattedError);
            return Response.failure(
              res,
              {
                message: `Something went wrong, email must be unique ${formattedError}`
              },
              HttpStatus.BadRequest
            );
          });
      })
      .catch(err => {
        this.logger.err("unable to check for email", err);
      });
  }

  /**
   * this method decrypts the appname based on what was sent
   *
   * @param params
   */
  decryptAppname(appname) {
    let trimAppName = appname
      .slice(0, -9)
      .substring(5)
      .split("")
      .reverse()
      .join("");
    const decodedAppname = base64.decode(trimAppName);
    return decodedAppname;
  }

  /**
   * this method hashes the decrypted password
   *
   * @param params
   */
  hashPassword(password) {
    const key1 = crypto.scryptSync(password, 'salt', 64);
    return key1.toString('hex');
  }

  /**
   * this method sends an email to the users
   *
   * @param req
   * @param res
   * @methodVerb POST
   */
  sendEmailAndCode(req, res) {
    const { email, base_url } = req.body;

    // check if required parameters were sent
    if (!email || !base_url) {
      return Response.failure(
        res,
        { message: "Error!! pls provide Email, base_url field" },
        HttpStatus.BadRequest
      );
    }
    return this.generateCodeAndSave(email)
      .then(data => {
        if (data === null) {
          return Response.failure(
            res,
            {
              message: "No email account found"
            },
            HttpStatus.NOT_FOUND
          );
        }
        const { code } = data;
        return SendMail(email, code, base_url)
          .then(() => {
            return Response.success(
              res,
              {
                message: "Code sent successfully to mail"
              },
              HttpStatus.OK
            );
          })
          .catch(err => {
            return Response.failure(
              res,
              {
                message: "Unable to send code to mail"
              },
              HttpStatus.BadRequest
            );
          });
      })
      .catch(() => {
        return Response.failure(
          res,
          {
            message: "Internal server Error"
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      });
  }

  // generate code and update in the DB
  generateCodeAndSave(email) {
    const code = uuid();
    let codeData = { code };
    const dataToUpdateBy = {
      email
    };
    return this.authService
      .getOneAndUpdateParams(dataToUpdateBy, codeData)
      .then(data => {
        return data;
      })
      .catch(() => {
        return;
      });
  }

  /**
   * this method verifies the users email
   *
   * @param req
   * @param res
   * @methodVerb POST
   */
  verifyUserEmail(req, res) {
    const { email, code } = req.body;

    // check if required fields were sent
    if (!code || !email) {
      return Response.failure(
        res,
        { message: "Error!! pls provide password, Code ,fields" },
        HttpStatus.BadRequest
      );
    }
    return this.authService
      .verifyUserEmailAndCode(email, code)
      .then(data => {
        if (data === null) {
          return Response.failure(
            res,
            {
              message: "No record with email and code"
            },
            HttpStatus.NOT_FOUND
          );
        }
        return Response.success(
          res,
          {
            message: "User email verified"
          },
          HttpStatus.OK
        );
      })
      .catch(() => {
        return Response.failure(
          res,
          {
            message: "INternal server Error"
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      });
  }

  //CDP

  updateUserRole(req, res) {
    const Authentication = req.header("Authentication", ["Authentication"]);
    // check if Authentication header was sent
    if (Authentication[0] === "Authentication") {
      return Response.failure(
        res,
        {
          message: "Bad Authentication"
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const decryptedAppName = this.decryptAppname(Authentication);
    const { userId } = req.params;
    let params = {};
    params.userId = userId;
    params.privilege = req.body.privilege;
    params.app_name = decryptedAppName;

    if (decryptedAppName === "cdp") {
      let app_name = decryptedAppName.toLowerCase();
      this.authService
        .getOne_cdp({ role: "superAdmin" })
        .then(data => {
          if (data.role !== "superAdmin") {
            return Response.failure(
              res,
              {
                message:
                  "Only super adminn users are allowed to update a user role"
              },
              HttpStatus.NOT_FOUND
            );
          }
          const updatedBy = data.userId;
          const { userId } = req.params;
          let params = {};
          params.userId = userId;
          params.role = req.body.role;
          params.app_name = app_name;
          return this.authService.updateUserRole(params).then(data => {
            if (data === null) {
              return Response.failure(
                res,
                {
                  message: "No record with userId found"
                },
                HttpStatus.NOT_FOUND
              );
            }
            return Response.success(
              res,
              {
                message: "User role updated successfully",
                response: { role: params.role, updatedBy: updatedBy }
              },
              HttpStatus.OK
            );
          });
        })
        .catch(e => {
          console.log(e, "error");
          return Response.failure(
            res,
            {
              message: "Internal server Error"
            },
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        });
    }
    return this.authService
      .updateUserPrivilege(params)
      .then(data => {
        console.log(data, "data")
        if (data === null) {
          return Response.failure(
            res,
            {
              message: "No record with userId found"
            },
            HttpStatus.NOT_FOUND
          );
        }
        return Response.success(
          res,
          {
            message: "User priviledge updated successfully",
            response: { priviledge: params.privilege }
          },
          HttpStatus.OK
        );
      })
      .catch(e => {
        // console.log(e, "error");
        return Response.failure(
          res,
          {
            message: "Internal server Error"
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      });
  }

  /**
   * this method resets passsword in case of change
   *
   * @param req
   * @param res
   * @methodVerb PUT
   */

  resetPassword(req, res) {
    const { oldPassword, newPassword, email } = req.body;

    //check if required fields were sent
    if (!oldPassword || !newPassword || !email) {
      return Response.failure(
        res,
        { message: "Error!! pls provide oldPassword, Email ,newPassword" },
        HttpStatus.BadRequest
      );
    }

    return this.authService.getOne({ email })
      .then((data) => {
        if (data === null){
          return Response.failure(
            res,
            {
              message: "No record with email"
            },
            HttpStatus.NOT_FOUND
          );
        }
      })

    const hashedOldPassword = this.hashPassword(oldPassword);
    const hashedNewPassword = this.hashPassword(newPassword);
    const newPassword = hashedPassword;
    return this.authService
      .updatePassword(email, app_name, newPassword)
      .then(data => {
        if (data === null) {
          return Response.failure(
            res,
            {
              message: "No record with email and app_name"
            },
            HttpStatus.NOT_FOUND
          );
        }
        return Response.success(
          res,
          {
            message: "Password reset successful"
          },
          HttpStatus.OK
        );
      })
      .catch(() => {
        return Response.failure(
          res,
          {
            message: "INternal server Error"
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      });
  }

  getAllUsers(req, res) {
    const { size, page } = req.query;
    const Authentication = req.header("Authentication", ["Authentication"]);
    // check if Authentication header was sent
    if (Authentication[0] === "Authentication") {
      return Response.failure(
        res,
        {
          message: "Bad Authentication"
        },
        HttpStatus.UNAUTHORIZED
      );
    }
    const decryptedAppName = this.decryptAppname(Authentication);

    if (decryptedAppName === "cdp") {
      let app_name = decryptedAppName.toLowerCase();
      let params_cdp = {
        app_name: app_name
      };
      if (size) {
        params_cdp.size = size;
      } else {
        params_cdp.size = 20;
      }
      if (page) {
        const newPage = page - 1;
        params_cdp.skip = size * newPage;
      }
      return this.authService
        .getAllUsersCDP(params_cdp, size)
        .then(response =>
          Response.success(res, {
            message: `${response.length} users were successfully fetched`,
            response: {
              users: response,
              total: response.length
            }
          })
        )
        .catch(error =>
          Response.failure(
            res,
            {
              message: error.msg,
              response: {}
            },
            HttpStatus.NOT_FOUND
          )
        );
    }

    let params = {
      app_name: decryptedAppName
    };

    if (size) {
      params.size = size;
    } else {
      params.size = 10;
    }

    if (page) {
      const newPage = page - 1;
      params.skip = size * newPage;
    }
    return this.authService
      .getAllUsers(params, size)
      .then(response =>
        Response.success(res, {
          message: `${response.length} users were successfully fetched`,
          response: {
            users: response,
            total: response.length
          }
        })
      )
      .catch(error =>
        Response.failure(
          res,
          {
            message: error.msg,
            response: {}
          },
          HttpStatus.NOT_FOUND
        )
      );
  }

  getAllUsersNoPagination(req, res) {
    const Authentication = req.header("Authentication", ["Authentication"]);
    // check if Authentication header was sent
    if (Authentication[0] === "Authentication") {
      return Response.failure(
        res,
        {
          message: "Bad Authentication"
        },
        HttpStatus.UNAUTHORIZED
      );
    }
    const decryptedAppName = this.decryptAppname(Authentication);

    if (decryptedAppName === "cdp") {
      let app_name = decryptedAppName.toLowerCase();
      let params_cdp = {
        app_name: app_name
      };
      return this.authService
        .getAllUsersNoPaginationCDP(params_cdp)
        .then(response =>
          Response.success(res, {
            message: `${response.length} users were successfully fetched`,
            response: {
              users: response,
              total: response.length
            }
          })
        )
        .catch(error =>
          Response.failure(
            res,
            {
              message: error.msg,
              response: {}
            },
            HttpStatus.NOT_FOUND
          )
        );
    }

    let params = {
      app_name: decryptedAppName
    };
    return this.authService
      .getAllUsersNoPagination(params)
      .then(response =>
        Response.success(res, {
          message: `${response.length} users were successfully fetched`,
          response: {
            users: response,
            total: response.length
          }
        })
      )
      .catch(error =>
        Response.failure(
          res,
          {
            message: error.msg,
            response: {}
          },
          HttpStatus.NOT_FOUND
        )
      );
  }

  getByUserId(req, res) {
    const Authentication = req.header("Authentication", ["Authentication"]);
    // check if Authentication header was sent
    if (Authentication[0] === "Authentication") {
      return Response.failure(
        res,
        {
          message: "Bad Authentication"
        },
        HttpStatus.UNAUTHORIZED
      );
    }
    const decryptedAppName = this.decryptAppname(Authentication);

    const { userId } = req.params;
    let param = {};
    param.userId = userId;
    param.app_name = decryptedAppName;

    if (decryptedAppName === "cdp") {
      let app_name = decryptedAppName.toLowerCase();
      let param_cdp = {};
      param_cdp.userId = userId;
      param_cdp.app_name = app_name;
      return this.authService
        .getByUserIdCDP(param_cdp)
        .then(data => {
          if (data === null) {
            return Response.failure(
              res,
              {
                message: "No record with userId and app_name"
              },
              HttpStatus.NOT_FOUND
            );
          }
          return Response.success(
            res,
            {
              message: "UserId data fetched successfully",
              response: data
            },
            HttpStatus.OK
          );
        })
        .catch(() => {
          return Response.failure(
            res,
            {
              message: "Internal server Error"
            },
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        });
    }

    return this.authService
      .getByUserId(param)
      .then(data => {
        if (data === null) {
          return Response.failure(
            res,
            {
              message: "No record with userId and app_name"
            },
            HttpStatus.NOT_FOUND
          );
        }
        return Response.success(
          res,
          {
            message: "UserId data fetched successfully",
            response: data
          },
          HttpStatus.OK
        );
      })
      .catch(() => {
        return Response.failure(
          res,
          {
            message: "Internal server Error"
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      });
  }

  //CDP

  getUserRole(req, res) {
    const Authentication = req.header("Authentication", ["Authentication"]);
    // check if Authentication header was sent
    if (Authentication[0] === "Authentication") {
      return Response.failure(
        res,
        {
          message: "Bad Authentication"
        },
        HttpStatus.UNAUTHORIZED
      );
    }
    const decryptedAppName = this.decryptAppname(Authentication);
    if (decryptedAppName === "cdp") {
      let app_name = decryptedAppName.toLowerCase();
      const { userId } = req.params;
      let param = {};
      param.userId = userId;
      param.app_name = app_name;
      return this.authService
        .getUserRole(param)
        .then(data => {
          if (data === null) {
            return Response.failure(
              res,
              {
                message: "No record with userId and app_name"
              },
              HttpStatus.NOT_FOUND
            );
          }
          return Response.success(
            res,
            {
              message: "User role successfully fetched",
              response: {
                role: data.role
              }
            },
            HttpStatus.OK
          );
        })
        .catch(() => {
          return Response.failure(
            res,
            {
              message: "Internal server Error"
            },
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        });
    }
  }

  //CDP
  /**
   * this method gets all users created by a super-admin based on that superAdminID
   *
   * @param req
   * @param res
   * @methodVerb GET
   */

  getAllUsersCreatedBySuperAdmin(req, res) {
    const Authentication = req.header("Authentication", ["Authentication"]);
    // check if Authentication header was sent
    if (Authentication[0] === "Authentication") {
      return Response.failure(
        res,
        {
          message: "Bad Authentication"
        },
        HttpStatus.UNAUTHORIZED
      );
    }
    const decryptedAppName = this.decryptAppname(Authentication);

    if (decryptedAppName === "cdp") {
      let app_name = decryptedAppName.toLowerCase();
      const { superAdminId } = req.params;
      let params = {};
      params.superAdminId = superAdminId;
      params.app_name = app_name;

      return this.authService
        .getAllCDP(params)
        .then(data => {
          if (data === null) {
            return Response.failure(
              res,
              {
                message: "No record with userId"
              },
              HttpStatus.NOT_FOUND
            );
          }
          return Response.success(
            res,
            {
              message: "User(s) successfully fetched",
              response: {
                data: data
              }
            },
            HttpStatus.OK
          );
        })
        .catch(e => {
          console.log(e, "error");
          return Response.failure(
            res,
            {
              message: "Internal server Error"
            },
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        });
    }
  }

  //CDP

  /**
   * this method deletes a user based on ID - only for superadmin users
   *
   * @param req
   * @param res
   * @methodVerb GET
   */

  deleteByUserId(req, res, next) {
    const Authentication = req.header("Authentication", ["Authentication"]);
    // check if Authentication header was sent
    if (Authentication[0] === "Authentication") {
      return Response.failure(
        res,
        {
          message: "Bad Authentication"
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const decryptedAppName = this.decryptAppname(Authentication);
    const { userId } = req.params;
    let param = {};
    param.userId = userId;
    param.app_name = decryptedAppName;

    if (decryptedAppName === "cdp") {
      let app_name = decryptedAppName.toLowerCase();
      let param_cdp = {};
      param_cdp.userId = userId;
      param_cdp.app_name = app_name;
      this.authService
        .getOneAndRemove_cdp(param_cdp)
        .then(data => {
          if (data === null) {
            return Response.failure(
              res,
              {
                message: "No record with userId"
              },
              HttpStatus.NOT_FOUND
            );
          }
          return Response.success(
            res,
            {
              message: "User deleted successfully"
            },
            HttpStatus.OK
          );
        })
        .catch(e => {
          return Response.failure(
            res,
            {
              message: "Internal server Error"
            },
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        });
    }

    this.authService
      .getOneAndRemove(param)
      .then(data => {
        if (data === null) {
          return Response.failure(
            res,
            {
              message: "No record with userId"
            },
            HttpStatus.NOT_FOUND
          );
        }
        return Response.success(
          res,
          {
            message: "User deleted successfully"
          },
          HttpStatus.OK
        );
      })
      .catch(e => {
        return Response.failure(
          res,
          {
            message: "Internal server Error"
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      });
  }

  //CDP

  /**
   * this method is a one time method to create a super admin user - CDP
   *
   * @param req
   * @param res
   * @methodVerb POST
   */
  createSuperAdminUser(req, res) {
    this.logger.info("creating a new super Admin user");

    const Authentication = req.header("Authentication", ["Authentication"]);
    // check if Authentication header was sent
    if (Authentication[0] === "Authentication") {
      return Response.failure(
        res,
        {
          message: "Bad Authentication"
        },
        HttpStatus.UNAUTHORIZED
      );
    }
    const decryptedAppName = this.decryptAppname(Authentication);

    if (decryptedAppName === "cdp") {
      let app_name = decryptedAppName.toLowerCase();
      const { password, email, role } = req.body;
      // check if all required parameters were passed
      if (!password || !email || !role) {
        return Response.failure(
          res,
          { message: "Error!! pls provide all sign up parameters" },
          HttpStatus.BadRequest
        );
      }

      this.authService.getOne_cdp({ email }, (err, existingUser) => {
        if (err) {
          return next(err);
        }

        // If user is not unique, return error
        if (existingUser) {
          return res
            .status(422)
            .send({ error: "That email address is already in use." });
        }
      });

      const hashedPassword = this.hashPassword(password);
      const params = {
        email,
        password: hashedPassword,
        app_name: app_name,
        role,
        userId: uuid()
      };

      return this.authService
        .checkForAppnameAndEmail(app_name, email)
        .then(resp => {
          if (resp !== null) {
            return Response.failure(
              res,
              {
                message: "email already exist for the appname"
              },
              HttpStatus.BadRequest
            );
          }
          return this.authService
            .saveNewUsersCDP(params)
            .then(data => {
              return Response.success(
                res,
                {
                  message: "super admin user successfully created",
                  response: {
                    userId: data.userId
                  }
                },
                HttpStatus.CREATED
              );
            })
            .catch(err => {
              let formattedError = err.msg;
              formattedError = JSON.stringify(formattedError);
              return Response.failure(
                res,
                {
                  message: `Something went wrong, email must be unique ${formattedError}`
                },
                HttpStatus.BadRequest
              );
            });
        })
        .catch(err => {
          console.log("unable to check for app name", err);
        });
    }
  }
}

module.exports = AuthController;
