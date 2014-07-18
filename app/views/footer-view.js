define([
  'jquery',
  'backbone',
  'dust',
  'dust.marionette',
  'footer-template'
], function ($, Backbone, dust, dustMarionette) {
  var FooterView = Backbone.View.extend({
    template: 'footer-template.dust',
    tagName:  'div class="container"'
  });

  return FooterView;
});