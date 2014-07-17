define([
  'jquery',
  'underscore',
  'marionette',
  'dust',
  'dust.marionette',
  'views/comment-view',
  'views/content-single-view-template',
  'views/article-template'
], function ($, _, Marionette, dust, dustMarionette, CommentView) {
  var ContentSingleView = Backbone.Marionette.CompositeView.extend({
    template:          'views/article-template.dust',
    childView:          CommentView,
    childViewContainer: '#b3-comments',

    serializeData: function () {
      return _.extend(this.model.toJSON(), {b3type: 'single-view'});
    },

    initialize: function () {
      this.model.fetchComments({
        done: function (data) { this.collection.add(data.models); }.bind(this),
        fail: function () { this.displayError(); }.bind(this)
      });
    },

    displayError: function () {

    }
  });

  return ContentSingleView;
});