define([
  'jquery',
  'marionette',
  'dust',
  'dust.marionette',
  'views/error-view-template'
], function ($, Marionette, dust, dustMarionette) {
  var ErrorView = Backbone.Marionette.ItemView.extend({
    tagName: 'div id="b3-error"',
    template: 'views/error-view-template.dust'
  });

  return ErrorView;
});