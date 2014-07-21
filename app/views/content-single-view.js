'use strict';

define([
  'jquery',
  'underscore',
  'marionette',
  'dust',
  'dust.marionette',
  'controllers/event-bus',
  'views/comment-view',
  'views/reply-form-view',
  'views/replyable-view',
  'content/content-template',
  'content/post-template'
], function ($, _, Marionette, dust, dustMarionette, EventBus, CommentView, ReplyFormView, ReplyableView) {
  var view = _.extend(ReplyableView, {
    template:  'content/post-template.dust',
    childView: CommentView,
    tagName: 'div id="post"',
    events: {
      'click .b3-reply-post': 'renderReplyBox',
    },

    initialize: function () {
      this.model.fetchComments({
        done: function (data) { this.collection.add(data.models); }.bind(this),
        fail: function () { this.displayError(); }.bind(this)
      });
      this.post = this.model;
    },

    parentId: function () {
      return 0;
    },

    serializeData: function () {
      return _.extend(this.model.toJSON(), {b3type: 'post', b3folder: 'content'});
    },

    onDestroy: function () {
      if (this.replyBoxRendered) {
        this.replyBox.destroy();
      }
    },

    attachHtml: function (collectionView, itemView, index) {
      this.collection.models[index].post = this.post;

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

  var ContentSingleView = Backbone.Marionette.CompositeView.extend(view);
  return ContentSingleView;
});