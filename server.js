const express = require('express');
const morgan = require('morgan');

const app = express();

const blogPostRouter = require('./blogPostRouter');

//use morgan to log the http layer
app.use(morgan('common'));

// use static to retrieve the static files from 'public' directory
app.use(express.static('public'));

//  get the root endpoint and respond with a json object
app.get('/', (req, res) => {
    console.log(req.body);
    res.json({message:'this is the route endpoint'});
    //res.json(BlogPosts.get());
    //res.sendFile(__dirname + '/views/index.html');
});



// when request come into `/blog-posts`, we will route them 
// to the express router instances we have imported.  These instances
// act as modular, mini-express apps.
app.use ('/blog-posts', blogPostRouter);

//  both runServer and closeServer need to access the same
//  server object, so we declare `server` here, and then when
//  runServer runs, it assigns a value.
let server;

//  this function starts our server and returns a Promise.
//  In our test code, we need a way of asynchronously starting
//  our server since we'll be dealing with promises there.
function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
        server = app
          .listen(port, () => {
              console.log(`blogpost-api app is listening on port ${port}`);
              resolve(server);
          })
          .on("error", err => {
              reject(err);
          });
    });
}

//  like `runServer`, this function also needs to return a promise.
//  `server.close` does not return a promise on its own, so we manually
//  create one.
function closeServer() {
    return new Promise((resolve, reject) => {
        console.log("Closeing server");
        server.close(err => {
            if (err) {
                reject(err);
                //  so we don't also call `resolve()`
                return;
            }
            resolve();
        });
    });
}

//  if server.js is called directly (aka, with `node server.js`), this block
//  runs. However, we also export the runServer command so other code (for instance, test code) 
//  can start the server as needed.
if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};


/*  this section is from the time before the testing
app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on posrt ${process.env.PORT} || 8080}`);
}); */
