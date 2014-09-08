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
  'main-template',
  'content/type-post-template',
  'content/type-page-template'
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

  var SinglePostView = ReplyableView.extend({
    template:  'main-template.dust',
    childView: CommentView,
    tagName:   'div id="post"',
    events: {
      'click .b3-reply-post':                 'renderReplyBox', // from ReplyableView
      'click .b3-pager-next':                 'displayNextPage',
      'click .b3-pager-previous':             'displayPrevPage',
      'click .b3-pagination .next a':         'displayNextPage',
      'click .b3-pagination .previous a':     'displayPrevPage',
      'click .b3-pagination .number a':       'displayPage',
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
      return _.extend(this._parseModel(), this._getDustTemplate());
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

    displayPrevPage: function (event) {
      event.preventDefault();
      if (this._hasPrevious()) {
        this.page--;
        this._renderPage();
      }
    },

    displayNextPage: function (event) {
      event.preventDefault();
      if (this._hasNext()) {
        this.page++;
        this._renderPage();
      }
    },

    displayPage: function (event) {
      event.preventDefault();
      if (this.page !== event.target.dataset.page) {
        this.page = parseInt(event.target.dataset.page, 10);
        this._renderPage();
      }
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
      return _.extend(model, this._getPagination());
    },

    _getDustTemplate: function () {
      var template = 'content/type-post-template.dust';
      var type     = this.post.get('type');
      var config   = Settings.get('require.config');

      if (config.paths['content/type-' + type + '-template']) {
        template = 'content/type-' + type + '-template.dust';
      }

      return { 'parent-template': template };
    },

    _getPagination: function () {
      var view = this;

      return {
        'has_next':     this._hasNext(),
        'has_previous': this._hasPrevious(),
        'pages':        this.content.length,

        'pageIterator': function (chunk, context, bodies) {
          var pages = context.current();

          _(pages).times(function (n) {
            var page = n + 1;
            chunk = chunk.render(bodies.block, context.push({
              'page':    page,
              'url':     view._getRoute(page),
              'current': page === parseInt(view.page, 10)
            }));
          });

          return chunk;
        }
      };
    },

    _hasNext: function () {
      var total = this.content.length;
      return (total > 1 && this.page < total);
    },

    _hasPrevious: function () {
      return this.page > 1;
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
