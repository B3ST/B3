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
  'controllers/navigation/navigator',
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
      'click .b3-post-categories > span > a': function (event) {
        this.displayType('archive:display:category', event);
      },
      'click .b3-post-tags > span > a':       function (event) {
        this.displayType('archive:display:tag', event);
      },
      'click .b3-post-author > span > a':     function (event) {
        this.displayType('archive:display:author', event);
      }
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
      var input = event.currentTarget.id;
      Navigator.navigateToPost(input, null, true);
      event.preventDefault();
    },

    displayType: function (type, event) {
      var id   = parseInt(event.currentTarget.id, 10),
          slug = $(event.currentTarget).attr('slug');

      EventBus.trigger(type, {id: id, slug: slug});
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
    }
  });

  return ArchiveView;
});
