define([
  'backbone',
  'marionette'
], function (Marionette) {
  var EventBus = new Backbone.Wreqr.EventAggregator();
  return EventBus;
});