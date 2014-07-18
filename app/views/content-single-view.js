'use strict';

define([
  'jquery',
  'underscore',
  'marionette',
  'dust',
  'dust.marionette',
  'views/comment-view',
  'content/content-single-template',
  'content/post-template'
], function ($, _, Marionette, dust, dustMarionette, CommentView) {
  var ContentSingleView = Backbone.Marionette.CompositeView.extend({
    template:  'content/post-template.dust',
    childView: CommentView,

    serializeData: function () {
      return _.extend(this.model.toJSON(), {b3type: 'single'});
    },

    initialize: function () {
      this.model.fetchComments({
        done: function (data) { this.collection.add(data.models); }.bind(this),
        fail: function () { this.displayError(); }.bind(this)
      });
    },

    attachHtml: function (collectionView, itemView, index) {
      if (itemView.model.get('parent') > 0) {
        collectionView.$('#comment-' + itemView.model.get('parent') + ' > ul.b3-comments').append(itemView.el);
      } else {
        var commentSection = collectionView.$('.b3-comments');
        $(commentSection[0]).append(itemView.el);
      }
    },

    displayError: function () {

    }
  });

  return ContentSingleView;
});