/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus',
  'models/settings-model'
], function (Backbone, Marionette, EventBus, Settings) {
  'use strict';

  var HomeAPI = Backbone.Marionette.Controller.extend({
    showHome: function (params) {
      var onFront = Settings.get('page_on_front');
      if (onFront > 0) {
        EventBus.trigger('single:show', { id: onFront });
      } else {
        EventBus.trigger('archive:show', params || {});
      }
    }
  });

  return HomeAPI;
});