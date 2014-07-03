define([
  'marionette',
  'controllers/controller'
], function(Marionette, Controller) {
  return Marionette.AppRouter.extend({
    //"index" must be a method in AppRouter's controller
    appRoutes: {
      "": "index"
    }
  });
});