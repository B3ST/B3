/* global define */

define([
  'backbone',
  'error/not-found-template'
], function (Backbone) {
  'use strict';

  var NotFoundView = Backbone.Marionette.ItemView.extend({
    tagName: 'div id="b3-error"',
    template: 'error/not-found-template.dust'
  });

  return NotFoundView;
});
