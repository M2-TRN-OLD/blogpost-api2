//  We will be using Mocha as our testing framework, but also
//  Chai which is a library of assertion statements
const chai = require("chai");
// we need to require chai-http so that we can test the http layer of the app
const chaiHttp = require("chai-http");

//  we need to require our server.js file and its modules app, runServer and closeServer
const {app, runServer, closeServer} = require("../server");

//  We use the expect function as a starting point for 
//  chaining other keywords like be and contain.  It is part of the chai listing of functions.
const expect = chai.expect;
chai.use(chaiHttp);

//  we use `describe` to create the structure for our tests.  `it` is the actual test.
describe("BlogPosts", function() {
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    //  test strategy for GET request
    //  1.  make request to '/blog-posts'
    //  2.  inspect response object for correct status and json format
    //  3.  further inspect that the res.body is and array, at least 1 item,
    //      has all expected keys and they are within an object.
    it("GET request should return an array of blogposts", function() {
        return chai
          .request(app)
          .get("/blog-posts")
          .then(function(res) {
              expect(res).to.have.status(200);
              expect(res).to.be.json;
              expect(res.body).to.be.a("array");
              expect(res.body.length).to.be.at.least(1);

              const expectedKeys = ["title", "content", "author"];
              res.body.forEach(function(item){
                  expect(item).to.be.a("object");
                  expect(item).to.include.keys(expectedKeys);
              });
          });
    });

    //  test strategy for POST request
    //  1.  make a POST request that includes data for a new item.
    //  2.  inspect response object for status and json format.
    //  3.  further, inspect res.body for object type, inclusion of all keys,
    //      that the id is not null and that the body is deep equal to
    //      the new item.
    it("POST should add a new blogpost to the database", function() {
        const newItem = {title: "my first day", content: "my feet are killing me", author: "FDM"};
        return chai
          .request(app)
          .post("/blog-posts")
          .send(newItem)
          .then(function(res) {
              expect(res).to.have.status(201);
              expect(res).to.be.json;
              expect(res.body).to.be.a("object");
              expect(res.body).to.include.keys("title", "content", "author");
              expect(res.body.id).to.not.equal(null);
              expect(res.body).to.deep.equal(
                  Object.assign(newItem, {id:res.body.id})
              );
          });
    });

    //  test strategy for PUT request:
    //  1.  initialize some update data(we need to objtain the `id`)
    //  2.  make a GET request so we can get a complete item to update
    //  3.  add the `id` to `updateData`
    //  4.  make the PUT request using teh `updateData`
    //  5.  inspect response object for status and json format(???).
    //  6.  further, inspect object body to make sure it is an object and that
    //      it is deep equal to updataData(???)
    it("PUT should make a change to an existing record in the database", function() {
        const badRequestData = {};
        return chai
          .request(app)
          .get("/blog-posts")
          .send(badRequestData)
          .then(function(res) {
              expect(res).to.have.status(400);
          });
    });

    //  test strategy for DELETE request:
    //  1.  make a GET reqeust to recipes in order to find the proper record with the proper id
    //  2.  make the DELETE reqeust and make sure that we return a status 204.
    if("DELETE should delte an existing blogpost in the database", function () {
        return (
            chai
              .request(app)
              .get("/blog-posts")
              .then(function(res) {
                  expect(res).to.have.status(204);
              })
        );
    });

});
