/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'dust',
  'dust.marionette',
  'models/settings-model',
  'buses/event-bus',
  'buses/navigator',
  'views/comment-view',
  'views/reply-form-view',
  'views/replyable-view',
  // Shims
  'templates/content/type-post-template',
  'templates/content/type-page-template',
  'templates/entry-meta-template'
], function ($, _, Backbone, Marionette, dust, dustMarionette, Settings, EventBus, Navigator, CommentView, ReplyFormView, ReplyableView) {
  'use strict';

  function scrollToReply (id) {
    var placeholder = "#comment-" + id,
        offset      = $(placeholder).offset();
    if (offset) {
      $('html,body').animate({
        scrollTop: offset.top - 100
      }, 'slow');
      $(placeholder).effect('highlight', {}, 1500);
    }
  }

  var SinglePostView = Backbone.Marionette.LayoutView.extend({
    tagName: 'div id="post"',
    regions: {
      pagination: '#pagination',
      comments:   '.comments'
    },

    events: {
      'click .b3-reply-post': 'renderReplyBox', // from ReplyableView
      'click .b3-post-categories > span > a': function (event) {
        this.displayType('single:display:category', event);
      },
      'click .b3-post-tags > span > a':       function (event) {
        this.displayType('single:display:tag', event);
      },
      'click .b3-post-author > span > a':     function (event) {
        this.displayType('single:display:author', event);
      },
      'click #b3-post-author > a':            function (event) {
        this.displayType('single:display:author', event);
      }
    },

    collectionEvents: {
      'sort':  'scrollToComment',
      'reset': 'render'
    },

    initialize: function (options) {
      this.page    = parseInt(options.page, 10) || 1;
      this.content = this.model.get('content').split(/<!--nextpage-->/);
      this.post    = this.model;
      this.user    = options.user;

      EventBus.trigger('title:change', this.model.get('title'));
    },

    scrollToComment: function (comments) {
      this.render();
      scrollToReply(comments.last().get('ID'));
    },

    parentId: function () {
      return 0;
    },

    serializeData: function () {
      var model = this._parseModel();
      console.log(model);
      return this._parseModel();
    },

    onDestroy: function () {
      if (this.replyBoxRendered) {
        this.replyBox.destroy();
      }
    },

    attachHtml: function (collectionView, itemView) {
      itemView.post = this.post;
      itemView.user = this.user;

      if (itemView.model.get('parent') > 0) {
        collectionView.$('#comment-' + itemView.model.get('parent') + ' > .comment-body > ul.b3-comments').append(itemView.el);
      } else {
        var commentSection = collectionView.$('.b3-comments');
        $(commentSection[0]).append(itemView.el);
      }
    },

    displayType: function (type, event) {
      var slug = $(event.currentTarget).attr('slug');
      EventBus.trigger(type, {slug: slug});
      event.preventDefault();
    },

    displayError: function () {
      this.$('.b3-comments').text('Could not retrieve comments.');
    },

    _renderPage: function () {
      this.render();
      EventBus.trigger('single:display:page', {page: this.page});
    },

    _parseModel: function () {
      var model = this.model.toJSON();
      model.content = this.content[this.page - 1];
      return model;
    },

    /**
     * Get route for this view instance.
     *
     * @param  {int}   page Page number.
     * @return {route}      Route.
     */
    _getRoute: function (page) {
      var type = this.model.get('type'),
          slug = this.model.get('slug');

      if (page === 1) {
        page = null;
      }

      return Navigator.getRouteOfType(type, slug, page);
    }
  });

  return SinglePostView;
});
