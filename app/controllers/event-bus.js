/* globals define */

define([
  'backbone',
  'marionette'
], function (Backbone) {
  'use strict';
  var EventBus = new Backbone.Wreqr.EventAggregator();
  return EventBus;
});
