/* global define */

define([
  'backbone',
  'marionette',
  'behaviors/display-archive-behavior'
], function (Backbone, Marionette, DisplayArchive) {
  'use strict';

  var DisplayTag = DisplayArchive.extend({
    defaults: {
      type: 'post_tag'
    },

    events: {
      'click @ui.tagLink': 'onArchiveLinkClicked'
    }
  });

  window.Behaviors.DisplayTag = DisplayTag;

  return DisplayTag;
});
