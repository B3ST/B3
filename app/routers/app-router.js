define([
  'marionette',
  'controllers/controller'
], function(Marionette, Controller) {
  return Marionette.AppRouter.extend({
    appRoutes: {
      "": "showPostPage",
      "page/:page": "showPostPage",
      "post/:slug/page/:page": "showPostBySlug",
      "post/:slug": "showPostBySlug",
      "post/:id": "showPostById",
      "*slug": "showPageBySlug"
    }
  });
});
