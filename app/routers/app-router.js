define([
  'marionette',
  'controllers/controller'
], function(Marionette, Controller) {
  return Marionette.AppRouter.extend({
    appRoutes: {
      "": "index",
      "post/:id": "showPost"
    }
  });
});