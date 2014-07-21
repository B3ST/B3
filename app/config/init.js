'use strict';

var root = WP_API_SETTINGS.root;
var deps = [
  "header-template",
  "footer-template",
  "content/post-template",
  "content/content-template",
  "content/comments/comment-template",
  "archive/posts-template",
  "error/not-found-template",
  "forms/searchform-template",
  "forms/replyform-template",
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
    "backbone.validateAll": ["backbone"]
  }
};

deps.forEach(function(dep) {
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
  "routers/app-router",
  "controllers/controller",
  "jqueryui",
  "bootstrap",
  "backbone.validateAll"
], function(_, $, Backbone, App, Settings, User, AppRouter, Controller) {
  var parseable_dates = ['date', 'modified', 'date_gmt', 'modified_gmt'];

  Backbone.Model.prototype.toJSON = function() {
    var attributes = _.clone(this.attributes),
      parseable_dates = ['date', 'modified', 'date_gmt', 'modified_gmt'];

    _.each(parseable_dates, function(key) {
      if (key in attributes) {
        attributes[key] = attributes[key].toISOString();
      }
    });

    if (this.get('author')) {
      attributes.author = this.get('author').attributes;
    }

    return attributes;
  };

  Backbone.Model.prototype.parse = function(response) {
    _.each(parseable_dates, function(key) {
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

  Backbone.Model.prototype.parent = function() {
    var object, parent = this.get('parent');

    if (parent === 0) {
      return null;
    }

    var parentModel = this;

    if (typeof this.parentModel !== 'undefined') {
      /**
       * Probably a better way to do this. Perhaps grab a cached version of the
       * instantiated model?
       */
      parentModel = new this.parentModel();
    }

    if (parentModel.collection) {
      return parentModel.collection.get(parent);
    } else {
      object = new parentModel.constructor(this.attributes);
      object.set('ID', parent);

      object.fetch();
      return object;
    }
  };

  Backbone.Model.prototype.sync = function(method, model, options) {
    options = options || {};

    var beforeSend = options.beforeSend;
    options.beforeSend = function(xhr) {
      xhr.setRequestHeader('X-WP-Nonce', Settings.get('nonce'));

      if (beforeSend) {
        return beforeSend.apply(this, arguments);
      }
    };

    return Backbone.sync(method, model, options);
  };

  App.appRouter = new AppRouter({
    controller: new Controller()
  });

  App.start();
});
