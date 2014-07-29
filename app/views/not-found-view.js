/* global define */

define([
  'backbone',
  'marionette',
  'error/not-found-template'
  /*jshint unused: false*/
], function (Backbone, Marionette) {
  'use strict';

  var NotFoundView = Backbone.Marionette.ItemView.extend({
    tagName: 'div id="b3-error"',
    template: 'error/not-found-template.dust'
  });

  return NotFoundView;
});
