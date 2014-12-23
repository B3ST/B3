/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus',
  'behaviors/display-archive-behavior'
], function (Backbone, Marionette, EventBus, DisplayArchive) {
  'use strict';

  var DisplayAuthor = DisplayArchive.extend({
    events: {
      'click @ui.authorLink': 'onAuthorLinkClicked'
    },

    /**
     * Author link activation handler.
     * @param {Event} event Click event.
     */
    onAuthorLinkClicked: function (event) {
      this._trigger(this.options.event, event, 'author');
      event.preventDefault();
    }
  });

  /**
   * Register behavior.
   * @type {DisplayAuthor}
   */
  window.Behaviors.DisplayAuthor = DisplayAuthor;

  return DisplayAuthor;
});
