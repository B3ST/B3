define([
  'jquery',
  'underscore',
  'marionette',
  'dust',
  'content-view-template',
  'entry-meta-template'
], function ($, _, Marionette, dust) {
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
      dust.render('views/entry-meta-template.dust', {posts: posts}, function (err, out) {
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