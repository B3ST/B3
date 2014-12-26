/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus'
], function (Backbone, Marionette, EventBus) {
  'use strict';

  var NavigationArchive = Marionette.Behavior.extend({
    events: {
      'click @ui.authorLink':   'onAuthorLinkClicked',
      'click @ui.categoryLink': 'onCategoryLinkClicked',
      'click @ui.tagLink':      'onTagLinkClicked'
    },

    onAuthorLinkClicked: function (event) {
      var args  = this._getEventArgs(event);
      args.type = 'author';
      EventBus.trigger('archive:view:display:author', args);
      event.preventDefault();
    },

    onCategoryLinkClicked: function (event) {
      var args  = this._getEventArgs(event);
      args.type = 'category';
      EventBus.trigger('archive:view:display:category', args);
      event.preventDefault();
    },

    onTagLinkClicked: function (event) {
      var args  = this._getEventArgs(event);
      args.type = 'post_tag';
      EventBus.trigger('archive:view:display:tag', args);
      event.preventDefault();
    },

    _getEventArgs: function (event) {
      return {
        id:   parseInt($(event.currentTarget).data('id'), 10),
        slug: $(event.currentTarget).data('slug')
      };
    }

  });

  window.Behaviors.NavigationArchive = NavigationArchive;

  return NavigationArchive;
});
