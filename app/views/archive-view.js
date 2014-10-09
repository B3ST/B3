/* global define */

define([
  'jquery',
  'backbone',
  'marionette',
  'helpers/renderer-helper',
  'buses/event-bus',
  // Shims
  'templates/archive/archive-template',
  'templates/archive/posts-template',
  'templates/entry-meta-template'
], function ($, Backbone, Marionette, Renderer, EventBus) {
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

    initialize: function () {
      var title = this.model ? this.model.get('name') : '';
      EventBus.trigger('title:change', title);
    },

    serializeData: function () {
      var hasHeader = this.model ? this.model.get('ID') !== null : false,
          header    = this.model ? this.model.toJSON() : {};
      return { posts: this.collection.toJSON(), hasHeader: hasHeader, header: header };
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
