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

    hasAll: function (data) {
      return _.all(data, function (el) {
        return !_.isEmpty(this.findWhere(this._findFilter(el)));
      }.bind(this));
    },

    _findFilter: function (el) {
      if (_.isUndefined(el.modified)) {
        return { ID: el.ID };
      }

      return _.isUndefined(this.model.prototype.defaults.modified) ? { ID: el.ID } : { ID: el.ID, modified: el.modified };
    }
  });

  return BaseCollection;
});