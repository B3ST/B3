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
      this.startHeartbeat(this.heartbeat);
    },

    startHeartbeat: function (heartbeat) {
      this.heartbeat = heartbeat;
      if (this.heartbeat) {
        EventBus.on(this.heartbeat, this.onHeartbeat, this);
      }
    },

    onHeartbeat: function (options) {
      if (!this.hasAll(options)) {
        this.fetch({ reset: true }).done(function () {
          var entry;
          _.each(options, function (el) {
            entry = this.findWhere({ ID: el.ID });
            entry.set({ 'new': true });
          }.bind(this));
        }.bind(this));
      }
    },

    stopHeartbeat: function () {
      if (this.heartbeat) {
        EventBus.off(this.heartbeat, this.onHeartbeat, this);
      }
    },

    hasAll: function (data) {
      return _.all(data, function (el) {
        return !_.isEmpty(this.find(function (model) {
          if (_.isUndefined(el.modified)) {
            return el.ID === model.get('ID');
          }

          if (_.isUndefined(model.get('modified'))) {
            return el.ID === model.get('ID');
          } else {
            var modified = new Date(Date.parse(el.modified)).toISOString();
            return el.ID === model.get('ID') &&
                    modified === model.get('modified').toISOString();
          }
        }));
      }.bind(this));
    }
  });

  return BaseCollection;
});