/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'models/settings-model',
  'buses/command-bus'
], function ($, _, Backbone, Settings, CommandBus) {
  'use strict';

  Backbone.Model.prototype.sync = function(method, model, options) {
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
  };
});