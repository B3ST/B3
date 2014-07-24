define([
  'jquery',
  'marionette',
  'controllers/event-bus'
], function ($, Marionette, EventBus) {
  var Navigator = Backbone.Model.extend({
    navigate: function (route, trigger) {
      EventBus.trigger('router:nav', {route: route, options: {trigger: trigger}});
    }
  });

  return new Navigator();
});