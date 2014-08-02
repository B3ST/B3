/* global WP_API_SETTINGS, require */

(function () {
  'use strict';

  var root = WP_API_SETTINGS.root;

  var templateDeps = [
    "header-template",
    "main-template",
    "footer-template",
    "content/type-post-template",
    "content/type-page-template",
    "content/comments/comment-template",
    "archive/posts-template",
    "error/not-found-template",
    "forms/searchform-template",
    "forms/replyform-template",
    "forms/navigation-search-template",
    "navigation/menus/menu-item-template",
    "widget-areas/sidebar-template"
  ];

  var config = {
    //urlArgs: "bust=" + (new Date()).getTime(),
    baseUrl: root + "/dist",
    paths: {
      "jquery":               root + "/lib/jquery",
      "jqueryui":             root + "/lib/jquery-ui",
      "underscore":           root + "/lib/lodash.compat",
      "backbone":             root + "/lib/backbone",
      "backbone.wreqr":       root + "/lib/backbone.wreqr",
      "backbone.babysitter":  root + "/lib/backbone.babysitter",
      "marionette":           root + "/lib/backbone.marionette",
      "dust":                 root + "/lib/dust-full.min",
      "dust.helpers":         root + "/lib/dust-helpers.min",
      "dust.marionette":      root + "/lib/backbone.marionette.dust",
      "backbone.validateAll": root + "/lib/Backbone.validateAll.min",
      "bootstrap":            root + "/lib/bootstrap",
      "bootstrap.notify":     root + "/lib/bootstrap-notify",
      "text":                 root + "/lib/text",
    },

    shim: {
      "bootstrap": ["jquery"],
      "jqueryui": ["jquery"],
      "backbone": {
        "deps": ["underscore"],
        "exports": "Backbone"
      },
      "marionette": {
        "deps": ["underscore", "backbone", "jquery"],
        "exports": "Marionette"
      },
      "dust": {
        "exports": "dust"
      },
      "dust.marionette": {
        "deps": ["marionette", "dust"],
        "exports": "dustMarionette",
      },

      "dust.helpers": {
        "deps": ["dust"],
        "exports": "dustHelpers"
      },

      // Backbone.validateAll plugin (https://github.com/gfranko/Backbone.validateAll)
      "backbone.validateAll": ["backbone"],
      "bootstrap.notify": ["bootstrap"]
    }
  };

  templateDeps.forEach(function(dep) {
    config.paths[dep] = root + "/dist/templates/" + dep;
    config.shim[dep] = {
      "deps": ["dust"]
    };
  });

  require.config(config);

  // Includes Desktop Specific JavaScript files here (or inside of your Desktop router)
  require([
    "underscore",
    "jquery",
    "backbone",
    "app",
    "models/settings-model",
    "models/user-model",
    'controllers/command-bus',
    "jqueryui",
    "bootstrap",
    "bootstrap.notify",
    "backbone.validateAll"
  ], function(_, $, Backbone, App, Settings, User, CommandBus) {
    var parseableDates = ['date', 'modified', 'date_gmt', 'modified_gmt'];

    Settings.set('require.config', config);

    Backbone.Model.prototype.toJSON = function() {
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
    };

    Backbone.Model.prototype.parse = function(response) {
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
    };

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

    App.start();
  });

})();
