define([
  'jquery',
  'marionette',
  'dust',
  'dust.marionette',
  'error/not-found-template'
], function ($, Marionette, dust, dustMarionette) {
  'use strict';

  var NotFoundView = Backbone.Marionette.ItemView.extend({
    tagName: 'div id="b3-error"',
    template: 'error/not-found-template.dust'
  });

  return NotFoundView;
});
