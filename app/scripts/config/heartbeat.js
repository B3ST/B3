/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'buses/event-bus'
], function ($, _, Backbone, Marionette, EventBus) {
  'use strict';

  var Heartbeat = Backbone.Marionette.Controller.extend({
    initialize: function () {
      $(document).on('heartbeat-tick', this.heartbeatTick.bind(this));
    },

    heartbeatTick: function (e, data) {
      var heartbeat = data.b3.live,
          keys      = _.keys(heartbeat);

      // console.log(data);

      _.each(keys, function (key) {
        if (!_.isEmpty(heartbeat[key])) {
          EventBus.trigger(key, heartbeat[key]);
        }
      });
    }
  });

  return Heartbeat;
});
