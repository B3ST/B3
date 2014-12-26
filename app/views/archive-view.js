/* global define */

define([
  'jquery',
  'backbone',
  'marionette',
  'helpers/dust/renderer-helper',
  'helpers/archive-header',
  'buses/event-bus',
  // Behavior shims
  'behaviors/navigation-behavior',
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
      postLink:     '.title > a',
      categoryLink: '.category > a',
      tagLink:      '.tag > a',
      authorLink:   '.author > a',
      taxonomyLink: '.taxonomy > a',
      link:         '.excerpt > a'
    },

    behaviors: {
      Navigation: {}
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
