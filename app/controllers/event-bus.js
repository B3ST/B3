define([
  'marionette'
], function (Marionette) {
  var EventBus = new Backbone.Marionette.EventAggregator();
  return EventBus;
});