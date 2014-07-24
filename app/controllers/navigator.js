define([
  'jquery',
  'backbone',
  'marionette',
  'controllers/event-bus'
], function ($, Backbone, Marionette, EventBus) {
  'use strict';

  var Navigator = Backbone.Model.extend({
    navigate: function (route, trigger) {
      EventBus.trigger('router:nav', {route: route, options: {trigger: trigger}});
    }
  });

  return new Navigator();
});
