require.config({
  baseUrl: "../../../../app",
  // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
  // probably a good idea to keep version numbers in the file names for updates checking
  paths: {
    // Core Libraries
    "jquery": "../../../../libs/jquery",
    "jqueryui": "../../../../libs/jqueryui",
    "underscore": "../../../../libs/lodash",
    "backbone": "../../../../libs/backbone",
    "marionette": "../../../../libs/backbone.marionette",
    "dust": "../../../../libs/dust",

    // Test Libraries
    "jasmine": "../../../../libs/jasmine",
    "jasmine-html": "../../../../libs/jasmine-html",
    "sinon": "../../../../libs/sinon",

    // Plugins
    "backbone.validateAll": "../../../../libs/plugins/Backbone.validateAll",
    "bootstrap": "../../../../libs/plugins/bootstrap",
    "text": "../../../../libs/plugins/text"
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
    "backbone.validateAll": ["backbone"],

    // Jasmine Unit Testing
    "jasmine": {
      // Exports the global 'window.jasmine' object
      "exports": "jasmine"
    },

    // Jasmine Unit Testing helper
    "jasmine-html": {
      "deps": ["jasmine"],
      "exports": "jasmine"
    }
  }
});

// Include Desktop Specific JavaScript files here (or inside of your Desktop router)
require([
  "jquery",
  "backbone",
  "marionette",
  "jasmine-html",
  "models/user-model",
  "bootstrap",
  "backbone.validateAll"
], function ($, Backbone, Marionette, jasmine, User) {
  var root = '../../../../test/jasmine/specs/';
  var specs = [
    // models
    root + 'core/models/base-model.spec',
    root + 'core/models/post-model.spec',
    root + 'core/models/post-status-model.spec',
    root + 'core/models/post-type-model.spec',
    root + 'core/models/revision-model.spec',
    root + 'core/models/comment-model.spec',
    root + 'core/models/page-model.spec',
    root + 'core/models/user-model.spec',
    root + 'core/models/taxonomy-model.spec',
    root + 'core/models/term-model.spec',
    root + 'core/models/media-model.spec',

    root + 'core/models/settings-model.spec',

    // collections
    root + 'core/collections/user-collection.spec',
    root + 'core/collections/post-collection.spec',
    root + 'core/collections/post-status-collection.spec',
    root + 'core/collections/post-type-collection.spec',
    root + 'core/collections/comment-collection.spec',
    root + 'core/collections/revision-collection.spec',
    root + 'core/collections/page-collection.spec',
    root + 'core/collections/taxonomy-collection.spec',
    root + 'core/collections/term-collection.spec',
    root + 'core/collections/media-collection.spec'

    // views
    root + 'core/views/header-view.spec',
    root + 'core/views/footer-view.spec',
    root + 'core/views/content-view.spec',

    // controllers
    root + 'core/controllers/controller.spec',

    // app
    root + 'core/app.spec'
  ];

  var parseable_dates = ['date', 'modified', 'date_gmt', 'modified_gmt'];

  Backbone.Model.prototype.toJSON = function() {
    var attributes = _.clone(this.attributes);

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
        response[key] = new Date(response[key]);
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

  $(function() {
    require(specs, function() {
      jasmine.getEnv().addReporter(new jasmine.HtmlReporter());
      jasmine.getEnv().execute();
    });
  });
});
