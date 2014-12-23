/* global define */

define([
  'backbone',
  'marionette',
  'behaviors/display-archive-behavior'
], function (Backbone, Marionette, DisplayArchive) {
  'use strict';

  var DisplayCategory = DisplayArchive.extend({
    events: {
      'click @ui.categoryLink': 'onCategoryLinkClicked'
    },

    onCategoryLinkClicked: function (event) {
      this._trigger(this.options.event, event, 'category');
      event.preventDefault();
    }
  });

  window.Behaviors.DisplayCategory = DisplayCategory;

  return DisplayCategory;
});
