/* global define */

define([
  'backbone',
  'marionette',
  // Shims
  'templates/footer-template'
], function (Backbone) {
  'use strict';

  var FooterView = Backbone.Marionette.ItemView.extend({
    template: 'footer-template.dust',
    tagName:  'div'
  });

  return FooterView;
});
