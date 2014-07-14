var deps = [
  "header-view-template",
  "footer-view-template",
  "entry-meta-template",
  "content-view-template"
];

var config = {
  //urlArgs: "bust=" + (new Date()).getTime(),
  baseUrl: WP_API_SETTINGS.root + "/app",
  // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
  // probably a good idea to keep version numbers in the file names for updates checking
  paths: {
    // Core Libraries
    "jquery":               WP_API_SETTINGS.root + "/libs/jquery",
    "jqueryui":             WP_API_SETTINGS.root + "/libs/jqueryui",
    "underscore":           WP_API_SETTINGS.root + "/libs/lodash",
    "backbone":             WP_API_SETTINGS.root + "/libs/backbone",
    "marionette":           WP_API_SETTINGS.root + "/libs/backbone.marionette",
    "dust":                 WP_API_SETTINGS.root + "/libs/dust",

    // Plugins
    "backbone.validateAll": WP_API_SETTINGS.root + "/libs/plugins/Backbone.validateAll",
    "bootstrap":            WP_API_SETTINGS.root + "/libs/plugins/bootstrap",
    "text":                 WP_API_SETTINGS.root + "/libs/plugins/text"
  },
  // Sets the configuration for your third party scripts that are not AMD compatible
  shim: {
    "bootstrap": ["jquery"],
    "jqueryui": ["jquery"],
    "backbone": {
      "deps": ["underscore"],
      // Exports the global window.Backbone object
      "exports": "Backbone"
    },
    "marionette": {
      "deps": ["underscore", "backbone", "jquery"],
      // Exports the global window.Marionette object
      "exports": "Marionette"
    },
    "dust": {
      "exports": "dust"
    },
    // Backbone.validateAll plugin (https://github.com/gfranko/Backbone.validateAll)
    "backbone.validateAll": ["backbone"]
  }
};

deps.forEach(function (dep) {
  config.paths[dep] = WP_API_SETTINGS.root + "/dist/templates/views/" + dep;
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
