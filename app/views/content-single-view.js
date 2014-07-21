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
  'content/content-template',
  'content/post-template'
], function ($, _, Marionette, dust, dustMarionette, EventBus, CommentView, ReplyFormView) {
  var ContentSingleView = Backbone.Marionette.CompositeView.extend({
    template:  'content/post-template.dust',
    childView: CommentView,
    events: {
      'click .b3-reply-post': 'renderReplyBox',
    },

    initialize: function () {
      this.model.fetchComments({
        done: function (data) { this.collection.add(data.models); }.bind(this),
        fail: function () { this.displayError(); }.bind(this)
      });
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
      if (itemView.model.get('parent') > 0) {
        collectionView.$('#comment-' + itemView.model.get('parent') + ' > ul.b3-comments').append(itemView.el);
      } else {
        var commentSection = collectionView.$('.b3-comments');
        $(commentSection[0]).append(itemView.el);
      }
    },

    renderReplyBox: function () {
      if (this.replyBoxRendered) {
        return;
      }

      this.replyBox = new ReplyFormView({model: this.model, parentView: this});
      this.replyBox.render();
      this.$('.b3-comment-section').html(this.replyBox.el);
    },

    replyRendered: function () {
      this.replyBoxRendered = true;
    },

    replyDestroyed: function () {
      this.replyBox = null;
      this.replyBoxRendered = false;
    },

    displayError: function () {

    }
  });

  return ContentSingleView;
});