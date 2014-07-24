define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'dust',
  'dust.marionette',
  'controllers/event-bus',
  'controllers/navigator',
  'archive/posts-template',
  'content/content-template'
], function ($, _, Backbone, Marionette, dust, dustMarionette, EventBus, Navigator) {
  'use strict';

  var ContentView = Backbone.Marionette.ItemView.extend({
    tagName:  'div id="posts" class="container"',
    template: 'content/content-template.dust',

    events: {
      'click .b3-post-title > a': 'selectPost',
      'click .pagination-next':   'renderNextPage',
      'click .pagination-prev':   'renderPrevPage'
    },

    collectionEvents: {
      "reset":  "render"
    },

    initialize: function (options) {
      this.page  = options.page || 1;
      this.limit = options.limit || 11;
    },

    serializeData: function () {
      return _.extend(this.getDustTemplate(), {posts: this.getModels()});
    },

    getModels: function () {
      return $.map(this.collection.models, function (post, index) {
        return post.toJSON();
      });
    },

    selectPost: function (ev) {
      var input = $(ev.currentTarget).attr('id');
      Navigator.navigate('post/' + input, true);
      return false;
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
      return _.extend({b3type: 'posts', b3folder: 'archive'}, this.getPagination());
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
      return {data: $.param({page: this.page}), reset: true};
    },

    navigate: function () {
      Navigator.navigate('page/' + this.page, false);
    }
  });

  return ContentView;
});
