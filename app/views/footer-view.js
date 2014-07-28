/* global define */

define([
  'jquery',
  'backbone',
  // Shims
  'footer-template'
], function ($, Backbone) {
  'use strict';

  var FooterView = Backbone.Marionette.ItemView.extend({
    template: 'footer-template.dust',
    tagName:  'div'
  });

  return FooterView;
});
