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
      'click @ui.authorLink':     'onAuthorLinkClicked',
      'click @ui.categoryLink':   'onLinkClicked',
      'click @ui.postLink':       'onLinkClicked',
      'click @ui.tagLink':        'onLinkClicked',
      'click @ui.taxonomyLink':   'onLinkClicked'
    },

    /**
     * [onAuthorLinkClicked description]
     * @param  {[type]} event [description]
     */
    onAuthorLinkClicked: function (event) {
      var $target = $(event.currentTarget),
        id   = $target.data('id'),
        slug = $target.data('slug'),
        page = $target.data('page') || 1;

      id   = parseInt(id, 10);
      page = parseInt(page, 10);

      if (slug.length === 0) {
        this.view.triggerMethod('link:clicked', event);
        return;
      }

      Navigator.navigateToAuthor(slug, page, true);
      event.preventDefault();
    },

    /**
     * Content link activation handler.
     * @param {Event} event Click event.
     */
    onLinkClicked: function (event) {
      var baseUrl = Settings.get('site_url'),
          $link   = $(event.currentTarget).attr('href');

      event.preventDefault();
      // FIXME: Handle relative URLs
      if ($link.indexOf(baseUrl) !== 0) {
        // Do not handle external links:
        return;
      }

      // the absolute home link will
      // equal baseUrl
      if ($link === baseUrl) {
        return Navigator.navigateToHome('', 0, true);
      }

      Navigator.navigateToLink($link, true);
    }
  });

  /**
   * Register behavior.
   * @type {Navigation}
   */
  window.Behaviors.Navigation = Navigation;

  return Navigation;
});
