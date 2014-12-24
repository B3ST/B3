/* global define */

define([
  'backbone',
  'marionette',
  'behaviors/display-archive-behavior'
], function (Backbone, Marionette, DisplayArchive) {
  'use strict';

  var DisplayCategory = DisplayArchive.extend({
    defaults: {
      type: 'category'
    },

    events: {
      'click @ui.categoryLink': 'onArchiveLinkClicked'
    }
  });

  window.Behaviors.DisplayCategory = DisplayCategory;

  return DisplayCategory;
});
