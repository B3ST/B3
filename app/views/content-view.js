define([
  'jquery',
  'underscore',
  'marionette',
  'dust',
  'dust.marionette',
  'controllers/event-bus',
  'content/content-multi-template',
  'content/post-template'
], function ($, _, Marionette, dust, dustMarionette, EventBus) {
  var ContentView = Backbone.Marionette.ItemView.extend({
    tagName:  'div id="posts"',
    template: 'content/post-template.dust',

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
      return {b3type: 'multi', posts: this.getModels()};
    },

    getModels: function () {
      return $.map(this.collection.models, function (post, index) {
        return post.toJSON();
      });
    },

    selectPost: function (ev) {
      var input   = ev.currentTarget.href,
          regex   = /post\/(.+)\/?$/,
          matches = input.match(regex);

      EventBus.trigger('router:nav', {route: 'post/' + matches[1], options: {trigger: true}});
      return false;
    }
  });

  return ContentView;
});
