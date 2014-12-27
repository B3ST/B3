/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus',
  'buses/navigator',
  'models/settings-model'
], function (Backbone, Marionette, EventBus, Navigator, Settings) {
  'use strict';

  var Navigation = Marionette.Behavior.extend({

    events: {
      'click @ui.navigationLink': 'onLinkClicked',

      'click @ui.authorLink':     'onAuthorLinkClicked',
      'click @ui.categoryLink':   'onLinkClicked',
      'click @ui.link':           'onLinkClicked',
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
        this.view.triggerMethod('LinkClicked', event);
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
        link = event.currentTarget.href;

      // FIXME: Allow relative URLs
      if (link.indexOf(baseUrl) !== 0) {
        // Do not handle external links:
        return;
      }

      Navigator.navigateToLink(link, true);

      // TODO: What are we to do with these triggers?
      // EventBus.trigger('navigation:link:clicked', { href: link });
      // EventBus.trigger('menu-item:view:navigate', { link: link });

      event.preventDefault();
    }
  });

  /**
   * Register behavior.
   * @type {Navigation}
   */
  window.Behaviors.Navigation = Navigation;

  return Navigation;
});
