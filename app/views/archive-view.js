/* global define */

define([
  'jquery',
  'backbone',
  'marionette',
  'helpers/post-filter',
  'buses/event-bus',
  'buses/command-bus',
  // Shims
  'templates/archive/posts-template',
  'templates/entry-meta-template'
], function ($, Backbone, Marionette, PostFilter, EventBus, CommandBus) {
  'use strict';

  var ArchiveView = Backbone.Marionette.LayoutView.extend({
    tagName:  'div id="archive"',
    template: 'archive/posts-template.dust',

    regions: {
      pagination: '#pagination-region'
    },

    events: {
      'click .title > a':    'onTitleClicked',
      'click .category > a': 'onCategoryClicked',
      'click .tag > a':      'onTagClicked',
      'click .author > a':   'onAuthorClicked'
    },

    collectionEvents: {
      'reset': 'render'
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
      return { posts: this.getModels(), title: this.title };
    },

    getModels: function () {
      return $.map(this.collection.models, function (post) {
        return post.toJSON();
      });
    },

    onTitleClicked: function (event) {
      var input = parseInt(event.currentTarget.id, 10);
      EventBus.trigger('archive:view:display:post', {post: input});
      event.preventDefault();
    },

    onCategoryClicked: function (event) {
      this._displayType('archive:view:display:category', event);
      event.preventDefault();
    },

    onTagClicked: function (event) {
      this._displayType('archive:view:display:tag', event);
      event.preventDefault();
    },

    onAuthorClicked: function (event) {
      this._displayType('archive:view:display:author', event);
      event.preventDefault();
    },

    _displayType: function (type, event) {
      var id   = parseInt(event.currentTarget.id, 10),
          slug = $(event.currentTarget).attr('slug');

      EventBus.trigger(type, {id: id, slug: slug});
    },
  });

  return ArchiveView;
});
