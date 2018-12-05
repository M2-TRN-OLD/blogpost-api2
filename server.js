const express = require('express');
const morgan = require('morgan');

const app = express();

const blogPostRouter = require('./blogPostRouter');

//log the http layer
app.use(morgan('common'));

app.use(express.static('public'));

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

app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on posrt ${process.env.PORT} || 8080}`);
});
