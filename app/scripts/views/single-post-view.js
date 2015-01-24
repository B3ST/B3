/* global define */

define([
  'backbone',
  'marionette',
  'models/settings-model',
  'buses/event-bus',
  // Shims
  'behaviors/transition-in-behavior',
  'behaviors/transitioned-navigation-behavior',
  'templates/content/type-post-template',
  'templates/content/type-page-template',
  'templates/entry-meta-template'
], function (Backbone, Marionette, Settings, EventBus) {
  'use strict';

  var SinglePostView = Backbone.Marionette.LayoutView.extend({
    tagName: 'div id="post"',
    regions: {
      pagination: '#pagination',
      comments:   '#comments-section'
    },

    ui: {
      postLink:       '.title > a',
      categoryLink:   '.category > a',
      tagLink:        '.tag > a',
      authorLink:     '.author > a, #author > a',
      taxonomyLink:   '.taxonomy > a',
      navigationLink: '.post-content > a'
    },

    behaviors: {
      TransitionedNavigation: {},
      TransitionIn: {}
    },

    modelEvents: {
      'change': 'renderContent'
    },

    initialize: function () {
      EventBus.trigger('title:change', this.model.get('title'));

      /**
       * FIXME: Menu may not yet be available at this point.
       */
      EventBus.trigger('change:menu:item:state', {
        object: this.model.get('ID'),
        objectParent: this.model.get('parent'),
        objectType: this.model.get('type')
      });
    },

    renderContent: function () {
      this.$('.entry-content').html(this.model.get('content'));
    },

    onDestroy: function () {
      if (this.replyBoxRendered) {
        this.replyBox.destroy();
      }
    },

    displayError: function () {
      this.$('.b3-comments').text('Could not retrieve comments.');
    },

  });

  return SinglePostView;
});
