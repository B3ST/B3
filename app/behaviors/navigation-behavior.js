/* global define */

define([
  'jquery',
  'backbone',
  'marionette',
  'buses/event-bus',
  'buses/navigator',
  'models/settings-model'
], function ($, Backbone, Marionette, EventBus, Navigator, Settings) {
  'use strict';

  var Navigation = Marionette.Behavior.extend({

    events: {
      'click @ui.navigationLink': 'onLinkClicked',
      'click @ui.authorLink':     'onLinkClicked',
      'click @ui.categoryLink':   'onLinkClicked',
      'click @ui.postLink':       'onLinkClicked',
      'click @ui.tagLink':        'onLinkClicked',
      'click @ui.taxonomyLink':   'onLinkClicked'
    },

    /**
     * Content link activation handler.
     * @param {Event} event Click event.
     */
    onLinkClicked: function (event) {
      var baseUrl = Settings.get('site_url'),
          link    = $(event.currentTarget).attr('href');

      event.preventDefault();
      // FIXME: Handle relative URLs
      if (link.indexOf(baseUrl) !== 0) {
        // Do not handle external links:
        return;
      }

      this.triggerMethod('navigate:link', { link: link, baseUrl: baseUrl });
    },

    onNavigateLink: function (options) {
      this.triggerMethod('navigate', options);
    },

    onNavigate: function (options) {
      var link    = options.link,
          baseUrl = options.baseUrl;

      // the absolute home link will
      // equal baseUrl
      if (link === baseUrl) {
        return Navigator.navigateToHome('', 0, true);
      }

      Navigator.navigateToLink(link, true);
    }
  });

  /**
   * Register behavior.
   * @type {Navigation}
   */
  window.Behaviors.Navigation = Navigation;

  return Navigation;
});
