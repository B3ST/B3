/* global define */

define([
  'backbone',
  'marionette',
  'helpers/dust/renderer-helper',
  'helpers/archive-header',
  'buses/event-bus',
  // Shims
  'behaviors/transition-in-behavior',
  'behaviors/transitioned-navigation-behavior',
  'behaviors/heartbeat-behavior',
  'templates/archive/archive-template',
  'templates/archive/posts-template',
  'templates/entry-meta-template'
], function (Backbone, Marionette, Renderer, ArchiveHeader, EventBus) {
  'use strict';

  var ArchiveView = Backbone.Marionette.LayoutView.extend({
    tagName:  'div id="archive"',
    template: false,

    regions: {
      pagination: '#pagination'
    },

    ui: {
      postLink:       '.title > a',
      categoryLink:   '.category > a',
      tagLink:        '.tag > a',
      authorLink:     '.author > a',
      taxonomyLink:   '.taxonomy > a',
      navigationLink: '.excerpt > a'
    },

    behaviors: {
      TransitionIn: {},
      TransitionedNavigation: {},
      Heartbeat: {}
    },

    collectionEvents: {
      'reset': 'renderPosts'
    },

    initialize: function (options) {
      options       = options || {};
      this.archive  = ArchiveHeader.archiveBy(this.collection, options.options);
      this.template = options.template || 'archive/archive-template.dust';

      EventBus.trigger('title:change', this.archive.name || this.archive.date);

      /**
       * FIXME: Menu may not yet be available at this point.
       */
      EventBus.trigger('change:menu:item:state', {
        object:       this.archive.ID,
        objectParent: this.archive.parent,
        objectType:   this.archive.taxonomy || ''
      });
    },

    serializeData: function () {
      return { posts: this.collection.toJSON(), archive: this.archive };
    },

    renderPosts: function () {
      this.$('.entries').html(this._getPosts());
    },

    _getPosts: function () {
      return Renderer.render('archive/posts-template.dust', this.serializeData());
    }
  });

  return ArchiveView;
});
