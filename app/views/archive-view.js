/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'dust',
  'dust.marionette',
  'helpers/post-filter',
  'controllers/bus/event-bus',
  'controllers/bus/command-bus',
  // Shims
  'main-template',
  'archive/posts-template'
], function ($, _, Backbone, Marionette, dust, dustMarionette, PostFilter, EventBus, CommandBus) {
  'use strict';

  var ArchiveView = Backbone.Marionette.ItemView.extend({
    tagName:  'div id="archive"',
    template: 'main-template.dust',

    events: {
      'click .b3-post-title > a':             'selectPost',
      'click .b3-pager-next':                 'renderNextPage',
      'click .b3-pager-previous':             'renderPrevPage',
      'click .b3-pagination .next a':         'renderNextPage',
      'click .b3-pagination .previous a':     'renderPrevPage',
      'click .b3-pagination .number a':       'renderPage',
      'click .b3-post-categories > span > a': 'displayCategory',
      'click .b3-post-tags > span > a':       'displayTag',
      'click .b3-post-author > span > a':     'displayAuthor'
    },

    collectionEvents: {
      "reset": "render"
    },

    initialize: function (options) {
      this.page  = options.page || 1;
      this.limit = options.limit || 10;
      this.title = options.title || false;
      this.total = options.total;

      EventBus.trigger('title:change');
    },

    onRender: function () {
      CommandBus.execute('loading:hide');
    },

    serializeData: function () {
      return _.extend(this.getDustTemplate(), {posts: this.getModels(), title: this.title});
    },

    getModels: function () {
      return $.map(this.collection.models, function (post) {
        return post.toJSON();
      });
    },

    selectPost: function (event) {
      var input = parseInt(event.currentTarget.id, 10);
      EventBus.trigger('archive:display:post', {post: input});
      event.preventDefault();
    },

    displayCategory: function (event) {
      this._displayType('archive:display:category', event);
      event.preventDefault();
    },

    displayTag: function (event) {
      this._displayType('archive:display:tag', event);
      event.preventDefault();
    },

    displayAuthor: function (event) {
      this._displayType('archive:display:author', event);
      event.preventDefault();
    },

    renderNextPage: function (event) {
      EventBus.trigger('archive:display:next:page', {});
      event.preventDefault();
    },

    renderPrevPage: function (event) {
      EventBus.trigger('archive:display:previous:page', {});
      event.preventDefault();
    },

    renderPage: function (event) {
      if (this.page !== event.target.dataset.page) {
        this.page = parseInt(event.target.dataset.page, 10);
        EventBus.trigger('archive:display:page', {paged: this.page});
      }
      event.preventDefault();
    },

    getDustTemplate: function () {
      return _.extend({'parent-template': 'archive/posts-template.dust'}, this.getPagination());
    },

    getPagination: function () {
      var has_next = !this._isLastPage(),
          has_prev = !this._isFirstPage(),
          pages    = this.total;

      return {
        'has_next':     has_next,
        'has_previous': has_prev,
        'pages':        pages,
        'pageIterator': function (chunk, context, bodies) {
          var pages = context.current();

          _(pages).times(function (n) {
            var page = n + 1;
            chunk = chunk.render(bodies.block, context.push({
              'page':    page,
              'url':     '#', // this._getRoute(page), TODO: put route here
              'current': page === parseInt(this.page, 10)
            }));
          }.bind(this));

          return chunk;
        }.bind(this)
      };
    },

    _isLastPage: function () {
      return this.page === this.total;
    },

    _isFirstPage: function () {
      return this.page === 1;
    },

    _displayType: function (type, event) {
      var id   = parseInt(event.currentTarget.id, 10),
          slug = $(event.currentTarget).attr('slug');

      EventBus.trigger(type, {id: id, slug: slug});
    },
  });

  return ArchiveView;
});
