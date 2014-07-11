define([
  'backbone',
  'marionette',
  'views/content-view'
], function (Backbone, Marionette, ContentView) {
  return Backbone.Marionette.Controller.extend({
    initialize: function(options) {
      this.app   = options.app;
      this.posts = options.posts;
    },

    index: function() {
      this.posts.fetch();
      this.app.main.show(new ContentView(this.posts));
    }
  });
});