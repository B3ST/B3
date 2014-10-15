/* global define */

define([
  'backbone',
  'marionette',
  'models/settings-model',
  'buses/event-bus',
  'buses/navigator',
  // Shims
  'templates/content/type-post-template',
  'templates/content/type-page-template',
  'templates/entry-meta-template'
], function (Backbone, Marionette, Settings, EventBus, Navigator) {
  'use strict';

  var SinglePostView = Backbone.Marionette.LayoutView.extend({
    tagName: 'div id="post"',
    regions: {
      pagination: '#pagination',
      comments:   '#comments-section'
    },

    events: {
      'click .category > a':     'onCategoryClicked',
      'click .tag > a':          'onTagClicked',
      'click .author > a':       'onAuthorClicked',
      'click #author > a':       'onAuthorClicked',
      'click .post-content > a': 'onLinkClicked'
    },

    modelEvents: {
      'change': 'renderContent'
    },

    initialize: function () {
      EventBus.trigger('title:change', this.model.get('title'));
    },

    renderContent: function () {
      this.$('.entry-content').html(this.model.get('content'));
    },

    onDestroy: function () {
      if (this.replyBoxRendered) {
        this.replyBox.destroy();
      }
    },

    onCategoryClicked: function (event) {
      this._triggerEvent('category', event);
      event.preventDefault();
    },

    onTagClicked: function (event) {
      this._triggerEvent('post_tag', event);
      event.preventDefault();
    },

    onAuthorClicked: function (event) {
      this._triggerEvent('author', event);
      event.preventDefault();
    },

    onLinkClicked: function (event) {
      var link = $(event.currentTarget).attr('href');
      EventBus.trigger('single:view:link:clicked', { href: link });
      event.preventDefault();
    },

    displayError: function () {
      this.$('.b3-comments').text('Could not retrieve comments.');
    },

    _triggerEvent: function (type, event) {
      var slug = $(event.currentTarget).attr('slug');
      EventBus.trigger('single:view:display:' + type, { slug: slug, type: type });
    }
  });

  return SinglePostView;
});
