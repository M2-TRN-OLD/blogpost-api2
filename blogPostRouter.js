//  we need to require the use of express framework
const express = require('express');

//  we need to require the use of the express router class to create router handlers.
const router = express.Router();

//  we need to requred the use of the node package body-parser, which is a middleware for
// breaking up and selecting portions of the body of a request.
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//  we will use the data models described in ./models.js and call them BlogPosts
const {BlogPosts} = require('./models');
//title: title,
//      content: content,
 //     author: author,


// I am adding some seed data.
BlogPosts.create(
    'crafts', 'I love crafts.  I love to paint and paste and glitter.', 'JDL'
);
BlogPosts.create(
    'hate crafts', 'I do not like crafts.  I like sports.  All kinds.  Soccer, football and basketball', 'MDM'
);
BlogPosts.create(
    'cooking', 'I am more into cooking.  Wow, I just love to make big pots of pasta sauce.', 'JFM'
);

// I am sending back JSON representation of all blogposts on the GET requests to the root
router.get('/', (req, res) => {
    //res.json({message:'this is the route inside th router'});
    //I want the response object to be in JSON format.  Please use the data model 'get' in BlogPosts.
    res.json(BlogPosts.get());
});

// when a new recipe is added, ensure that it has required fields.
//  If no, log an error and return 400 status code with helpful message.
//  If all required fields are there, add the new item and return it with status 201.
router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for(let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `no \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(item);
});

// delete blogpost by id
router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blogpost item \`${req.params.ID}\``);
    res.status(204).end();
});

// when a PUT request comes in with and updated blogpost, ensure 
// that the required fields are there.  Also, ensure that blogpost id
// in the updated blogpost item object are a match.  If there are any 
// problems, log the error and send back a status code of 400.  Otherwise,
//  (if everything is there) call `BlogPosts.updateItem` with the updated blogpost.
router.put('/:id', jsonParser, (req, res) => {
    console.log(req.body);
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
          const message = `Missing \`${field}\` in request body`
          console.error(message);
          return res.status(400).send(message);
        }
      };
      if (req.params.id !== req.body.id) {
        const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
        console.error(message);
        return res.status(400).send(message);
      }
      console.log(`Updating shopping list item \`${req.params.id}\``);
      BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
      });
      res.status(204).end();
});

module.exports = router;