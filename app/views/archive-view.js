/* global define */

define([
  'jquery',
  'backbone',
  'marionette',
  'helpers/dust/renderer-helper',
  'helpers/archive-header',
  'buses/event-bus',
  // Behavior shims
  'behaviors/display-post-behavior',
  'behaviors/display-taxonomy-behavior',
  'behaviors/display-category-behavior',
  'behaviors/display-tag-behavior',
  'behaviors/display-author-behavior',
  'behaviors/display-link-behavior',
  // Template shims
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

    ui: {
      'postLink':     '.title > a',
      'categoryLink': '.category > a',
      'tagLink':      '.tag > a',
      'authorLink':   '.author > a',
      'taxonomyLink': '.taxonomy > a',
      'link':         '.excerpt > a'
    },

    behaviors: {
      DisplayPost:     { event: 'archive:view:display:post' },
      DisplayTaxonomy: { event: 'archive:view:display:taxonomy' },
      DisplayCategory: { event: 'archive:view:display:category' },
      DisplayTag:      { event: 'archive:view:display:tag' },
      DisplayAuthor:   { event: 'archive:view:display:author' },
      DisplayLink:     { event: 'archive:view:link:clicked' }
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
      this.collection.stopHeartbeat();
    },

    _getPosts: function () {
      return Renderer.render('archive/posts-template.dust', this.serializeData());
    }
  });

  return ArchiveView;
});
