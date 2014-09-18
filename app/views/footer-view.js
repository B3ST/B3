/* global define */

define([
  'jquery',
  'backbone',
  'marionette',
  // Shims
  'templates/footer-template'
  /*jshint unused: false*/
], function ($, Backbone, Marionette) {
  'use strict';

  var FooterView = Backbone.Marionette.ItemView.extend({
    template: 'footer-template.dust',
    tagName:  'div'
  });

  return FooterView;
});
