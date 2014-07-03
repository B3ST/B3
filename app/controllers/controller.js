define([
  'app',
  'backbone',
  'marionette',
  'models/post-model'
], function(App, Backbone, Marionette, Post) {
  return Backbone.Marionette.Controller.extend({
    initialize: function(options) {

    },

    index: function() {
      console.log(new Post());
    }
  });
});