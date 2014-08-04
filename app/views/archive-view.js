/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'dust',
  'dust.marionette',
  'helpers/post-filter',
  'controllers/event-bus',
  'controllers/command-bus',
  'controllers/navigator',
  // Shims
  'main-template',
  'archive/posts-template'
], function ($, _, Backbone, Marionette, dust, dustMarionette, PostFilter, EventBus, CommandBus, Navigator) {
  'use strict';

  var ArchiveView = Backbone.Marionette.ItemView.extend({
    tagName:  'div id="archive"',
    template: 'main-template.dust',

    events: {
      'click .b3-post-title > a':             'selectPost',
      'click .b3-pager-next':                 'renderNextPage',
      'click .b3-pager-previous':             'renderPrevPage',
      'click .b3-post-categories > span > a': 'displayCategory',
      'click .b3-post-tags > span > a':       'displayTag',
      'click .b3-post-author > span > a':     'displayAuthor'
    },

    collectionEvents: {
      "reset":  "render"
    },

    initialize: function (options) {
      this.page   = options.page || 1;
      this.limit  = options.limit || 10;
      this.filter = options.filter || new PostFilter();

      EventBus.trigger('title:change');
    },

    onRender: function () {
      CommandBus.execute('loading:hide');
    },

    serializeData: function () {
      return _.extend(this.getDustTemplate(), {posts: this.getModels()});
    },

    getModels: function () {
      return $.map(this.collection.models, function (post) {
        return post.toJSON();
      });
    },

    selectPost: function (event) {
      var input = $(event.currentTarget).attr('id');
      Navigator.navigate('post/' + input, true);
      event.preventDefault();
    },

    displayCategory: function (event) {
      var id   = event.currentTarget.id,
          slug = $(event.currentTarget).attr('slug');

      this.filter = new PostFilter();
      this.filter.byCategoryId(id);

      this.collection.fetch(this.getParams());
      Navigator.navigate('post/category/' + slug, false);

      event.preventDefault();
    },

    displayTag: function (event) {
      var slug = $(event.currentTarget).attr('slug');

      this.filter = new PostFilter();
      this.filter.byTag(slug);

      this.collection.fetch(this.getParams());
      Navigator.navigate('post/tag/' + slug, false);

      event.preventDefault();
    },

    displayAuthor: function (event) {
      var id   = event.currentTarget.id,
          slug = $(event.currentTarget).attr('slug');

      this.filter = new PostFilter();
      this.filter.byAuthorId(id);

      this.collection.fetch(this.getParams());
      Navigator.navigate('post/author/' + slug, false);

      event.preventDefault();
    },

    renderNextPage: function (event) {
      event.preventDefault();

      if (!this.isLastPage()) {
        this.page++;
        this.collection.fetch(this.getParams());
        this.navigate();
      }
    },

    renderPrevPage: function (event) {
      event.preventDefault();

      if (!this.isFirstPage()) {
        this.page--;
        this.collection.fetch(this.getParams());
        this.navigate();
      }
    },

    getDustTemplate: function () {
      return _.extend({'parent-template': 'archive/posts-template.dust'}, this.getPagination());
    },

    getPagination: function () {
      var has_next = !this.isLastPage();
      var has_prev = !this.isFirstPage();
      var pages    = 999; // TODO: Try to get number of results

      return {
        'has_next':     has_next,
        'has_previous': has_prev,
        'pages':        pages
      };
    },

    isLastPage: function () {
      return this.collection.models.length === 0;
    },

    isFirstPage: function () {
      return this.page === 1;
    },

    getParams: function () {
      this.filter.onPage(this.page);
      return {data: this.filter.serialize(), reset: true};
    },

    navigate: function () {
      var route = Navigator.getPagedRoute(this.filter, this.page);
      Navigator.navigate(route, false);
    }
  });

  return ArchiveView;
});
