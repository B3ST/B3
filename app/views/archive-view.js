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
    template: false,

    regions: {
      pagination: '#pagination'
    },

    events: {
      'click .title > a':    'onTitleClicked',
      'click .category > a': 'onCategoryClicked',
      'click .tag > a':      'onTagClicked',
      'click .author > a':   'onAuthorClicked',
      'click .taxonomy > a': 'onTaxonomyClicked',
      'click .excerpt > a':  'onLinkClicked'
    },

    collectionEvents: {
      'reset': 'renderPosts'
    },

    initialize: function (options) {
      options       = options || {};
      this.archive  = ArchiveHeader.archiveBy(this.collection, options.options);
      this.template = options.template || 'archive/archive-template.dust';
      EventBus.trigger('title:change', this.archive.name || this.archive.date);
    },

    serializeData: function () {
      return { posts: this.collection.toJSON(), archive: this.archive };
    },

    renderPosts: function () {
      this.$('.entries').html(this._getPosts());
    },

    onBeforeDestroy: function () {
      this.collection.dismissHeartbeat();
    },

    onTitleClicked: function (event) {
      var slug = $(event.currentTarget).attr('slug'),
          id   = parseInt(event.currentTarget.id, 10),
          post = this.collection.findWhere({ ID: id });

      EventBus.trigger('archive:view:display:post', { slug: slug, post: post });
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

    onTaxonomyClicked: function (event) {
      var link = $(event.currentTarget).attr('href');
      EventBus.trigger('archive:view:display:taxonomy', { href: link });
      event.preventDefault();
    },

    onLinkClicked: function (event) {
      var link = $(event.currentTarget).attr('href');
      EventBus.trigger('archive:view:link:clicked', { href: link });
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
