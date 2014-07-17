define([
  'jquery',
  'underscore',
  'marionette',
  'dust',
  'dust.marionette',
  'controllers/event-bus',
  'views/content-view-template',
  'views/article-template'
], function ($, _, Marionette, dust, dustMarionette, EventBus) {
  var ContentView = Backbone.Marionette.ItemView.extend({
    tagName:  'div id="posts"',
    template: 'views/article-template.dust',

    events: {
      'click .b3-post-title > a': 'selectPost'
    },

    collectionEvents: {
      "add":    "render",
      "change": "render",
      "remove": "render",
      "reset":  "render"
    },

    serializeData: function () {
      return {b3type: 'view', posts: this.getModels()};
    },

    getModels: function () {
      return $.map(this.collection.models, function (post, index) {
        return post.toJSON();
      });
    },

    selectPost: function (ev) {
      var input   = ev.currentTarget.id,
          regex   = /(\d+)/,
          matches = input.match(regex);

      EventBus.trigger('router:nav', {route: 'post/' + matches[1], options: {trigger: true}});
      return false;
    }
  });

  return ContentView;
});