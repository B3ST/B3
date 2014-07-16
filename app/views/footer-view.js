define([
  'jquery',
  'backbone',
  'dust',
  'dust.marionette',
  'views/footer-view-template'
], function ($, Backbone, dust, dustMarionette) {
  var FooterView = Backbone.View.extend({
    template: 'views/footer-view-template.dust',
    tagName:  'div class="container"'
  });

  return FooterView;
});