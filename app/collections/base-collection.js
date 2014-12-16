/* global define */

define([
  'underscore',
  'backbone',
  'buses/event-bus'
], function (_, Backbone, EventBus) {
  'use strict';

  var BaseCollection = Backbone.Collection.extend({
    constructor: function () {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      if (this.heartbeat) {
        EventBus.on(this.heartbeat, this.onHeartbeat, this);
      }
    },

    onHeartbeat: function (options) {
      if (!this.hasAll(options)) {
        this.fetch({ reset: true });
      }
    },

    dismissHeartbeat: function () {
      EventBus.off(this.heartbeat, this.onHeartbeat, this);
    },

    hasAll: function (values) {
      return _.all(values, function (value) {
        return !_.isEmpty(this.findWhere({ ID: value }));
      }.bind(this));
    }
  });

  return BaseCollection;
});