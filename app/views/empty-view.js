/* global define */

define([
  'jquery',
  'backbone',
  'marionette'
  /* jshint unused: false */
], function ($, Backbone, Marionette) {
  'use strict';

  var EmptyView = Backbone.Marionette.ItemView.extend({
    tagName: 'div id="empty"',
    render: function () {
      return this;
    }
  });

  return EmptyView;
});