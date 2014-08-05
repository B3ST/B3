/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'models/user-model',
  'models/settings-model',
  'controllers/bus/command-bus'
], function ($, _, Backbone, User, Settings, CommandBus) {
  'use strict';

  var parseableDates = ['date', 'modified', 'date_gmt', 'modified_gmt'];
  var RewriteModel = {
    toJSON: function() {
      var attributes = _.clone(this.attributes);

      _.each(parseableDates, function(key) {
        if (key in attributes) {
          attributes[key] = attributes[key].toISOString();
        }
      });

      if (this.get('author')) {
        attributes.author = this.get('author').attributes;
      }

      if (_.isObject(this.get('post'))) {
        attributes.post = this.get('post').toJSON();
      }

      return attributes;
    },

    parse: function(response) {
      _.each(parseableDates, function(key) {
        if (response.hasOwnProperty(key)) {
          var timestamp = Date.parse(response[key]);
          response[key] = new Date(timestamp);
        }
      });

      if (response.author) {
        response.author = new User(response.author);
      }

      return response;
    },

    sync: function(method, model, options) {
      options = options || {};

      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr, settings) {
        xhr.setRequestHeader('X-WP-Nonce', Settings.get('nonce'));

        settings.xhr = function () {
          var xhr = $.ajaxSettings.xhr();
          xhr.onprogress = function (evt) {
            if (evt.lengthComputable) {
              CommandBus.execute('loading:progress', {loaded: evt.loaded, total: evt.total});
            }
          };

          return xhr;
        };

        if (beforeSend) {
          return beforeSend.apply(this, arguments);
        }
      };

      return Backbone.sync(method, model, options);
    }
  };

  return RewriteModel;
});