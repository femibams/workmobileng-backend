/**
 * Created by Femibams on 16/09/2019.
 */
const MongoDBHelper = require("../lib/MongoDBHelper");
const AuthModel = require("../model/authModel");
const config = require("../config/config");

class Question {
  /**
   * The constructor
   *
   * @param logger
   * @param mongoclient
   * */
  constructor(logger, mongoclient) {
    this.logger = logger;
    this.mongoDBClientHelper = new MongoDBHelper(mongoclient, AuthModel);
  }

  /**
   * logs user
   *
   * @param questionId - the Id of the user to retrieve
   * @returns {Promise}
   */

  checkForEmail(email) {
    const param = {
      email
    };
    return this.mongoDBClientHelper.getOne(param);
  }

  saveNewUsers(data) {
    return this.mongoDBClientHelper.save(data);
  }

  verifyUserEmailAndCode(email, code) {
    const param = {
      email,
      code
    };
    let params = {
      email
    };
    let data = {
      verified: true
    };
    return this.mongoDBClientHelper.getOneAndUpdate(param, data);
    // return this.getOneAndUpdateParams(param, data);
    // return this.mongoDBClientHelper.getOne(param);
  }

  updatePassword(email, password) {
    const params = {
      email
    };
    const data = { password };
    return this.mongoDBClientHelper.getOneAndUpdate(params, data);
  }

  getOne(data) {
    return this.mongoDBClientHelper.getOne(data);
  }

  getOneAndUpdateParams(params, data) {
    return this.mongoDBClientHelper.getOneAndUpdate(params, data);
  }

  getAllUsers(params, size = null) {
    return new Promise((resolve, reject) => {
      // get the formatted query body
      const searchParams = { app_name: params.app_name };
      let skipParam = {};
      if (params.size) {
        skipParam.limit = params.size;
      }
      if (params.skip) {
        skipParam.skip = params.skip;
      }

      return this.mongoDBClientHelper
        .getBulk(searchParams, skipParam)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }

  getAllUsersNoPagination(params) {
    return this.mongoDBClientHelper.findAll(params);
  }

  getOneAndRemove(param) {
    return this.mongoDBClientHelper.getOneAndRemove(param);
  }

  getByUserId(param) {
    return this.mongoDBClientHelper.getOne(param);
  }

  updateUserPrivilege(params) {
    return this.mongoDBClientHelper.getOneAndUpdate(
      {
        userId: params.userId
      },
      { privilege: params.privilege }
    );
  }
}
module.exports = Question;
