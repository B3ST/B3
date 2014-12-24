/* global define */

define([
  'backbone',
  'marionette',
  'behaviors/display-archive-behavior'
], function (Backbone, Marionette, DisplayArchive) {
  'use strict';

  var DisplayAuthor = DisplayArchive.extend({
    defaults: {
      type: 'author'
    },

    events: {
      'click @ui.authorLink': 'onArchiveLinkClicked'
    }
  });

  /**
   * Register behavior.
   * @type {DisplayAuthor}
   */
  window.Behaviors.DisplayAuthor = DisplayAuthor;

  return DisplayAuthor;
});
