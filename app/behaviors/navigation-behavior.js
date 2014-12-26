/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus',
  'buses/navigator'
], function (Backbone, Marionette, EventBus, Navigator) {
  'use strict';

  var Navigation = Marionette.Behavior.extend({

    events: {
      'click @ui.authorLink':   'onAuthorLinkClicked',
      'click @ui.categoryLink': 'onLinkClicked',
      'click @ui.link':         'onLinkClicked',
      'click @ui.postLink':     'onLinkClicked',
      'click @ui.tagLink':      'onLinkClicked',
      'click @ui.taxonomyLink': 'onLinkClicked'
    },

    /**
     * [onAuthorLinkClicked description]
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    onAuthorLinkClicked: function (event) {
      var $target = $(event.currentTarget),
        id   = $target.data('id'),
        slug = $target.data('slug'),
        type = $target.data('type'),
        page = $target.data('page') || 1;

      id   = parseInt(id, 10);
      page = parseInt(page, 10);

      if (slug.length === 0) {
        this.onLinkClicked(event);
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
      var href = $(event.currentTarget).attr('href');
      Navigator.navigateToLink(href, true);
      // EventBus.trigger('navigation:link:clicked', { href: link });
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
