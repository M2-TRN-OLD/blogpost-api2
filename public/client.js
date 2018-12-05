
var blogPostTemplate = (
    '<li class="js-blog-post">' +
      '<p><span class="blog-post js-blog-post-name"></span></p>' +
      '<div class="blog-post-controls">' +
        '<button class="js-blog-post-toggle">' +
          '<span class="button-label">check</span>' +
        '</button>' +
        '<button class="js-blog-post-delete">' +
          '<span class="button-label">delete</span>' +
        '</button>' +
      '</div>' +
    '</li>'
  );
}
  
  
  var BLOG_POST_URL = '/blog-post';
  
  
  function getAndDisplayBlogPost() {
    console.log('Retrieving blog-post')
    $.getJSON(BLOG_POST_URL, function(blogposts) {
      console.log('Rendering blog post');
      var blogpostElements = blogpost.map(function(blogpost) {
        var element = $(blogpostTemplate);
        element.attr('id', blogpost.id);
        element.find('.js-blog-post-name').text(blogpost.name);
        blogposts.forEach(function(blogpost) {
          element.find('.js-blog-posts').append(
            '<li>' + blogpost + '</li>');
        });
        return element;
      });
      $('.js-blog-post').html(blog-postElement)
    });
  }
  
  function addBlogPost(blogpost) {
    console.log('Adding blogpost: ' + blogpost);
    $.ajax({
      method: 'POST',
      url: blog-post_URL,
      data: JSON.stringify(blogpost),
      success: function(data) {
        getAndDisplayBlogPost();
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  }
  
  function deleteBlogPost(blogpostId) {
    console.log('Deleting blogpost `' + blogpostId + '`');
    $.ajax({
      url: BLOG_POST_URL + '/' + blogpostId,
      method: 'DELETE',
      success: getAndDisplayBlogPost
    });
  }
  
  function updateBlogPost(blogpost) {
    console.log('Updating blogpost `' + blogpost.id + '`');
    $.ajax({
      url: BLOG_POST_URL + '/' + blogpost.id,
      method: 'PUT',
      data: blogpost,
      success: function(data) {
        getAndDisplayBlogPost();
      }
    });
  }
  
  function handleBlogPostAdd() {
    $('#js-blog-post-form').submit(function(e) {
      e.preventDefault();
      var ingredients = $(
        e.currentTarget).find(
        '#ingredients-list').val().split(',').map(
          function(ingredient) { return ingredient.trim() });
      addBlogPost({
        name: $(e.currentTarget).find('#recipe-name').val(),
        ingredients: ingredients
      });
    });
  }
  
  function handleBlogPostDelete() {
    $('.js-blog-post').on('click', '.js-blog-post-delete', function(e) {
      e.preventDefault();
      deleteBlogPost(
        $(e.currentTarget).closest('.js-blog-post').attr('id'));
    });
  }
  
  $(function() {
    getAndDisplayBlogPost();
    handleBlogPostAdd();
    handleBlogPostDelete();
  });