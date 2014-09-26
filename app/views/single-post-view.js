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
      'click .category > a':  'onCategoryClicked',
      'click .tag > a':       'onTagClicked',
      'click .author > a':    'onAuthorClicked',
      'click #author > a':    'onAuthorClicked'
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

    _triggerEvent: function (type, event) {
      var slug = $(event.currentTarget).attr('slug');
      EventBus.trigger('single:view:display:' + type, { slug: slug, type: type });
    },

    displayError: function () {
      this.$('.b3-comments').text('Could not retrieve comments.');
    },

    _renderPage: function () {
      this.render();
      EventBus.trigger('single:display:page', { page: this.page });
    },

    /**
     * Get route for this view instance.
     *
     * @param  {int}   page Page number.
     * @return {route}      Route.
     */
    _getRoute: function (page) {
      var type = this.model.get('type'),
          slug = this.model.get('slug');

      if (page === 1) {
        page = null;
      }

      return Navigator.getRouteOfType(type, slug, page);
    }
  });

  return SinglePostView;
});
