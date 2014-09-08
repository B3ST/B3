/* global require*/

(function() {
  'use strict';

  var root = ".";

  var templateDeps = [
    "header-template",
    "footer-template",
    "loading-template",
    "content/type-post-template",
    "content/type-page-template",
    "main-template",
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
    baseUrl: root + "app",
    paths: {
      "jquery":               "../lib/jquery",
      "jqueryui":             "../lib/jquery-ui",
      "underscore":           "../lib/lodash.compat",
      "backbone":             "../lib/backbone",
      "backbone.wreqr":       "../lib/backbone.wreqr",
      "backbone.babysitter":  "../lib/backbone.babysitter",
      "marionette":           "../lib/backbone.marionette",
      "dust":                 "../lib/dust-full.min",
      "dust.helpers":         "../lib/dust-helpers.min",
      "dust.marionette":      "../lib/backbone.marionette.dust",
      "backbone.validateAll": "../lib/Backbone.validateAll.min",
      "bootstrap":            "../lib/bootstrap",
      "bootstrap.notify":     "../lib/bootstrap-notify",
      "text":                 "../lib/text",
      "jasmine":              "../lib/jasmine",
      "jasmine-html":         "../lib/jasmine-html",
      "boot":                 "../lib/boot",
      "sinon":                "../lib/sinon",
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

      "bootstrap.notify": ["bootstrap"],

      "backbone.validateAll": ["backbone"],

      "jasmine": {
        "exports": "jasmine"
      },

      "jasmine-html": {
        "deps": ["jasmine"],
        "exports": "jasmine"
      },

      "boot": {
        "deps": ["jasmine", "jasmine-html"],
        "exports": "jasmine"
      },
    }
  };

  templateDeps.forEach(function(dep) {
    config.paths[dep] = "../dist/templates/" + dep;
    config.shim[dep] = {
      "deps": ["dust", "dust.helpers"]
    };
  });

  require.config(config);

  var specsRoot = '../test/jasmine/specs/';
  var specs = [
    // models
    specsRoot + 'core/models/base-model.spec',
    specsRoot + 'core/models/post-model.spec',
    specsRoot + 'core/models/post-status-model.spec',
    specsRoot + 'core/models/post-type-model.spec',
    specsRoot + 'core/models/revision-model.spec',
    specsRoot + 'core/models/comment-model.spec',
    specsRoot + 'core/models/page-model.spec',
    specsRoot + 'core/models/user-model.spec',
    specsRoot + 'core/models/taxonomy-model.spec',
    specsRoot + 'core/models/term-model.spec',
    specsRoot + 'core/models/media-model.spec',

    specsRoot + 'core/models/settings-model.spec',
    specsRoot + 'core/models/menu-model.spec',
    specsRoot + 'core/models/menu-item-model.spec',
    specsRoot + 'core/models/sidebar-model.spec',
    specsRoot + 'core/models/widget-model.spec',

    // collections
    specsRoot + 'core/collections/user-collection.spec',
    specsRoot + 'core/collections/post-collection.spec',
    specsRoot + 'core/collections/post-status-collection.spec',
    specsRoot + 'core/collections/post-type-collection.spec',
    specsRoot + 'core/collections/comment-collection.spec',
    specsRoot + 'core/collections/revision-collection.spec',
    specsRoot + 'core/collections/page-collection.spec',
    specsRoot + 'core/collections/taxonomy-collection.spec',
    specsRoot + 'core/collections/term-collection.spec',
    specsRoot + 'core/collections/media-collection.spec',

    specsRoot + 'core/collections/menu-item-collection.spec',
    specsRoot + 'core/collections/widget-collection.spec',

    // views
    specsRoot + 'core/views/header-view.spec',
    specsRoot + 'core/views/footer-view.spec',
    specsRoot + 'core/views/archive-view.spec',
    specsRoot + 'core/views/single-post-view.spec',
    specsRoot + 'core/views/comment-view.spec',
    specsRoot + 'core/views/not-found-view.spec',
    specsRoot + 'core/views/reply-form-view.spec',
    specsRoot + 'core/views/menu-view.spec',
    specsRoot + 'core/views/menu-item-view.spec',
    specsRoot + 'core/views/sidebar-view.spec',
    specsRoot + 'core/views/search-view.spec',
    specsRoot + 'core/views/loading-view.spec',

    // helpers
    specsRoot + 'core/helpers/post-filter.spec',

    // controllers
    specsRoot + 'core/controllers/single-controller.spec',
    specsRoot + 'core/controllers/archive-controller.spec',
    specsRoot + 'core/controllers/search-controller.spec',
    specsRoot + 'core/controllers/loading-controller.spec',
    specsRoot + 'core/controllers/taxonomy-controller.spec',
    specsRoot + 'core/controllers/navigation/navigator.spec',

    // app
    specsRoot + 'core/app.spec'
  ];


  // Include Desktop Specific JavaScript files here (or inside of your Desktop router)
  require([
    "jquery",
    "underscore",
    "backbone",
    "marionette",
    "boot",
    "models/settings-model",
    "config/rewrite",
    "bootstrap",
    "bootstrap.notify",
    "backbone.validateAll",

    "../test/jasmine/config/using",
    "../test/jasmine/config/stub-server"
  ], function ($, _, Backbone, Marionette, jasmine, Settings, Rewrite) {

    require(specs, function() {
      Settings.set('require.config', config);

      Backbone.Model.prototype.toJSON = Rewrite.toJSON;
      Backbone.Model.prototype.parse = Rewrite.parse;

      if (!String.prototype.supplant) {
        String.prototype.supplant = function(o) {
          return this.replace(/\{([^{}]*)\}/g, function(a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
          });
        };
      }

      window.onload();
      // jasmine.getEnv().addReporter(new jasmine.HtmlReporter());
      // jasmine.getEnv().execute();
    });
  });
})();
