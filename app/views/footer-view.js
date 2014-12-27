/* global define */

define([
  'backbone',
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
