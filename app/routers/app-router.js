define([
  'marionette',
  'controllers/controller'
], function(Marionette, Controller) {
  return Marionette.AppRouter.extend({
    appRoutes: {
      "": "index",
      "post/:slug/page/:page": "showPostBySlug",
      "post/:slug": "showPostBySlug",
      "post/:id": "showPostById"
    }
  });
});
