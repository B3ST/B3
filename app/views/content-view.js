define([
  'jquery',
  'underscore',
  'marionette',
  'dust',
  'controllers/event-bus',
  'views/content-view-template',
  'views/article-template'
], function ($, _, Marionette, dust, EventBus) {
  var ContentView = Backbone.Marionette.ItemView.extend({
    tagName: 'div id="posts"',

    events: {
      'click .b3-ph': 'selectPost'
    },

    collectionEvents: {
      "add":    "render",
      "change": "render",
      "remove": "render",
      "reset":  "render"
    },

    initialize: function (posts) {
      this.collection = posts;
    },

    render: function () {
      this.template(this.getModels());
      return this;
    },

    template: function (posts) {
      dust.render('views/article-template.dust', {b3type: 'view', posts: posts}, function (err, out) {
        this.$el.html(out);
      }.bind(this));
    },

    getModels: function () {
      return $.map(this.collection.models, function (post, index) {
        return post.toJSON();
      });
    },

    selectPost: function (ev) {
      ev.preventDefault();
      var input   = ev.currentTarget.id,
          regex   = /(\d+)/,
          matches = input.match(regex);

      EventBus.trigger('router:nav', {route: 'post/' + matches[1], options: {trigger: true}});
    }
  });

  return ContentView;
});