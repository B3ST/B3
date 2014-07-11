define([
  'jquery',
  'underscore',
  'marionette',
  'dust',
  'text!templates/views/content-view-template.html'
], function ($, _, Marionette, dust, ContentViewTemplate) {
  var ContentView = Backbone.Marionette.ItemView.extend({
    tagName: 'div id="posts"',

    initialize: function (posts) {
      this.posts = posts;

      _.bindAll(this, 'render');
      this.listenTo(this.posts, 'add', this.render);
      this.listenTo(this.posts, 'change', this.render);
      this.listenTo(this.posts, 'remove', this.render);
      this.listenTo(this.posts, 'reset', this.render);
    },

    render: function () {
      this.template(this.getModels());
      return this;
    },

    template: function (posts) {
      var compiled = dust.compile(ContentViewTemplate, 'render:content');
      dust.loadSource(compiled);

      dust.render('render:content', {posts: posts}, function (err, out) {
        this.$el.html(out);
      }.bind(this));
    },

    getModels: function () {
      return $.map(this.posts.models, function (post, index) {
        return post.toJSON();
      });
    }
  });

  return ContentView;
});