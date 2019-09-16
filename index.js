/**
 * Created by Bamidele Oluwafemi on 13/09/2019.
 * objective: building to scale
 */

// Load on dev environment
const dotenv = require("dotenv");

dotenv.config();

const config = require("./app/config/config");
const authRoute = require("./app/routes/auth");
const restify = require("restify");
const plugins = require("restify-plugins");
const referrerPolicy = require("referrer-policy");
// service locator via dependency injection
const serviceLocator = require("./app/config/di");
const corsMiddleware = require("restify-cors-middleware");

const logger = serviceLocator.get("logger");

const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ["*"],
  allowHeaders: ["content-type", "authentication", "authorization"],
  exposeHeaders: ["content-type", "authentication", "authorization"]
});

const server = restify.createServer({
  name: config.appName,
  versions: ["1.0.0"]
});
// set request handling and parsing

server.pre(cors.preflight);
server.use(cors.actual);
server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser());
server.use(plugins.bodyParser());
server.pre(restify.pre.sanitizePath());
restify.defaultResponseHeaders = function(data) {
  this.header(server, "Authorization");
};

server.use(referrerPolicy({ policy: "no-referrer-when-downgrade" }));

// setup Routing and Error Event Handling
authRoute.setup(server, serviceLocator);

server.listen(config.server.port, () => {
  console.log("%s listening at %s", config.appName, config.server.port);
});
module.exports = server;
