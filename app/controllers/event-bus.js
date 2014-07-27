/* globals define */

define([
  'backbone',
  'marionette'
], function (Backbone, Marionette) {
  'use strict';
  var EventBus = new Backbone.Wreqr.EventAggregator();
  return EventBus;
});
