var deps = [
  "views/header-view-template",
  "views/footer-view-template",
  "views/entry-meta-template",
  "views/content-view-template"
];

var config = {
  //urlArgs: "bust=" + (new Date()).getTime(),
  baseUrl: WP_API_SETTINGS.root + "/app",
  paths: {
    "jquery":               WP_API_SETTINGS.root + "/lib/jquery",
    "jqueryui":             WP_API_SETTINGS.root + "/lib/jquery-ui",
    "underscore":           WP_API_SETTINGS.root + "/lib/lodash.compat",
    "backbone":             WP_API_SETTINGS.root + "/lib/backbone",
    "backbone.wreqr":       WP_API_SETTINGS.root + "/lib/backbone.wreqr",
    "backbone.babysitter":  WP_API_SETTINGS.root + "/lib/backbone.babysitter",
    "marionette":           WP_API_SETTINGS.root + "/lib/backbone.marionette",
    "dust":                 WP_API_SETTINGS.root + "/lib/dust-full.min",
    "dust.marionette":      WP_API_SETTINGS.root + "/lib/backbone.marionnette.dust",
    "backbone.validateAll": WP_API_SETTINGS.root + "/lib/Backbone.validateAll.min",
    "bootstrap":            WP_API_SETTINGS.root + "/lib/bootstrap",
    "text":                 WP_API_SETTINGS.root + "/lib/text",

    "templates":            WP_API_SETTINGS.root + "/dist/templates/views"
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
      "deps": ["dust"],
      "exports": "dustMarionette",
    },
    "templates": ["dust", "dust.marionette"],
    // Backbone.validateAll plugin (https://github.com/gfranko/Backbone.validateAll)
    "backbone.validateAll": ["backbone"]
  }
};

deps.forEach(function (dep) {
  config.paths[dep] = WP_API_SETTINGS.root + "/dist/templates/" + dep;
  config.shim[dep] = {
    "deps": ["dust"]
  }
});

require.config(config);

// Includes Desktop Specific JavaScript files here (or inside of your Desktop router)
require([
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
], function ($, Backbone, App, Settings, User, AppRouter, Controller) {
  var parseable_dates = ['date', 'modified', 'date_gmt', 'modified_gmt'];

  Backbone.Model.prototype.toJSON = function() {
    var attributes      = _.clone(this.attributes),
        parseable_dates = ['date', 'modified', 'date_gmt', 'modified_gmt'];

    _.each(parseable_dates, function(key) {
      if (key in attributes) {
        attributes[key] = attributes[key].toISOString();
      }
    });

    if (this.get('author')) {
      attributes['author'] = this.get('author').attributes;
    }

    return attributes;
  };

  Backbone.Model.prototype.parse = function(response) {
    _.each(parseable_dates, function (key) {
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

  Backbone.Model.prototype.sync = function (method, model, options) {
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
