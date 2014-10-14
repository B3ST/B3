/* global define */

define([
  'jquery',
  'backbone',
  'marionette',
  'helpers/dust/renderer-helper',
  'helpers/archive-header',
  'buses/event-bus',
  // Shims
  'templates/archive/archive-template',
  'templates/archive/posts-template',
  'templates/entry-meta-template'
], function ($, Backbone, Marionette, Renderer, ArchiveHeader, EventBus) {
  'use strict';

  var ArchiveView = Backbone.Marionette.LayoutView.extend({
    tagName:  'div id="archive"',
    template: 'archive/archive-template.dust',

    regions: {
      pagination: '#pagination'
    },

    events: {
      'click .title > a':    'onTitleClicked',
      'click .category > a': 'onCategoryClicked',
      'click .tag > a':      'onTagClicked',
      'click .author > a':   'onAuthorClicked'
    },

    collectionEvents: {
      'reset': 'renderPosts'
    },

    initialize: function (options) {
      options = options || {};
      this.archive = ArchiveHeader.archiveBy(this.collection, options.options);
      EventBus.trigger('title:change', this.archive || this.archive.name || this.archive.date);
    },

    serializeData: function () {
      return { posts: this.collection.toJSON(), archive: this.archive };
    },

    renderPosts: function () {
      this.$('.entries').html(this._getPosts());
    },

    onTitleClicked: function (event) {
      var post = $(event.currentTarget).attr('slug');
      EventBus.trigger('archive:view:display:post', { post: post });
      event.preventDefault();
    },

    onCategoryClicked: function (event) {
      this._triggerEvent('archive:view:display:category', event, 'category');
      event.preventDefault();
    },

    onTagClicked: function (event) {
      this._triggerEvent('archive:view:display:tag', event, 'post_tag');
      event.preventDefault();
    },

    onAuthorClicked: function (event) {
      this._triggerEvent('archive:view:display:author', event, 'author');
      event.preventDefault();
    },

    _triggerEvent: function (ev, event, type) {
      var id   = parseInt(event.currentTarget.id, 10),
          slug = $(event.currentTarget).attr('slug');

      EventBus.trigger(ev, { id: id, slug: slug, type: type });
    },

    _getPosts: function () {
      return Renderer.render('archive/posts-template.dust', this.serializeData());
    }
  });

  return ArchiveView;
});
