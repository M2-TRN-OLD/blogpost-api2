//  we need to require chai, a testing framework
const chai = require("chai");
// we need to require chai-http so that we can test the http layer of the app
const chaiHttp = require("chai-http");

//  we need to require our server.js file and its modules app, runServer and closeServer
const {app, runServer, closeServer} = require("../server");