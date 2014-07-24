define([
  'jquery',
  'backbone',
  'dust',
  'dust.marionette',
  'footer-template'
], function ($, Backbone, dust, dustMarionette) {
  'use strict';

  var FooterView = Backbone.Marionette.ItemView.extend({
    template: 'footer-template.dust',
    tagName:  'div'
  });

  return FooterView;
});
