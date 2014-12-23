/* global define */

define([
  'backbone',
  'marionette',
  'behaviors/display-archive-behavior'
], function (Backbone, Marionette, DisplayArchive) {
  'use strict';

  var DisplayTag = DisplayArchive.extend({
    events: {
      'click @ui.tagLink': 'onTagLinkClicked'
    },

    onTagLinkClicked: function (event) {
      this._trigger(this.options.event, event, 'post_tag');
      event.preventDefault();
    }
  });

  window.Behaviors.DisplayTag = DisplayTag;

  return DisplayTag;
});
