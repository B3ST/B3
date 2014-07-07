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
    "handlebars": "../../../../libs/handlebars",

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
    "handlebars": {
      "exports": "Handlebars"
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
require(["jquery", "backbone", "marionette", "jasmine-html", "bootstrap", "backbone.validateAll"],
  function($, Backbone, Marionette, jasmine) {
    var root  = '../../../../test/jasmine/specs/';
    var specs = [
      // models
      root + 'core/models/post-model.spec',
      root + 'core/models/post-status-model.spec',
      root + 'core/models/post-type-model.spec',
      root + 'core/models/page-model.spec',
      root + 'core/models/user-model.spec',
      root + 'core/models/taxonomy-model.spec',
      root + 'core/models/media-model.spec',

      // collections
      root + 'core/collections/user-collection.spec',
      root + 'core/collections/post-collection.spec',
      root + 'core/collections/post-status-collection.spec',
      root + 'core/collections/post-type-collection.spec',
      root + 'core/collections/page-collection.spec',
      root + 'core/collections/taxonomy-collection.spec',
      root + 'core/collections/media-collection.spec'
    ];

    $(function() {
      require(specs, function() {
        jasmine.getEnv().addReporter(new jasmine.HtmlReporter());
        jasmine.getEnv().execute();
      });
    });
  });