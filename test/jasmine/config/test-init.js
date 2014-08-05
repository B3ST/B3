/* global require*/

(function () {
  'use strict';

  var root = "../../../..";
  var templateDeps = [
    "header-template",
    "footer-template",
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
    baseUrl: root + "/app",
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
      "jasmine":              root + "/libs/jasmine",
      "jasmine-html":         root + "/libs/jasmine-html",
      "sinon":                root + "/libs/sinon",
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
      }
    }
  };

  templateDeps.forEach(function(dep) {
    config.paths[dep] = root + "/dist/templates/" + dep;
    config.shim[dep]  = {
      "deps": ["dust", "dust.helpers"]
    };
  });

  require.config(config);

  // Include Desktop Specific JavaScript files here (or inside of your Desktop router)
  require([
    "jquery",
    "underscore",
    "backbone",
    "marionette",
    "jasmine-html",
    "models/settings-model",
    "config/rewrite",
    "bootstrap",
    "bootstrap.notify",
    "backbone.validateAll"
  ], function ($, _, Backbone, Marionette, jasmine, Settings, Rewrite) {
    var root = '../../../../test/jasmine/specs/';

    Settings.set('require.config', config);

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
      root + 'core/models/menu-model.spec',
      root + 'core/models/menu-item-model.spec',
      root + 'core/models/sidebar-model.spec',
      root + 'core/models/widget-model.spec',

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
      root + 'core/collections/media-collection.spec',

      root + 'core/collections/menu-item-collection.spec',
      root + 'core/collections/widget-collection.spec',

      // views
      root + 'core/views/header-view.spec',
      root + 'core/views/footer-view.spec',
      root + 'core/views/archive-view.spec',
      root + 'core/views/single-post-view.spec',
      root + 'core/views/comment-view.spec',
      root + 'core/views/not-found-view.spec',
      root + 'core/views/reply-form-view.spec',
      root + 'core/views/menu-view.spec',
      root + 'core/views/menu-item-view.spec',
      root + 'core/views/sidebar-view.spec',
      root + 'core/views/search-view.spec',
      root + 'core/views/loading-view.spec',

      // helpers
      root + 'core/helpers/post-filter.spec',

      // controllers
      root + 'core/controllers/single-type-controller.spec',
      root + 'core/controllers/archive-type-controller.spec',
      root + 'core/controllers/search-controller.spec',
      root + 'core/controllers/navigation/navigator.spec',

      // app
      root + 'core/app.spec'
    ];

    Backbone.Model.prototype.toJSON = Rewrite.toJSON;
    Backbone.Model.prototype.parse  = Rewrite.parse;

    if (!String.prototype.supplant) {
      String.prototype.supplant = function(o) {
        return this.replace(/\{([^{}]*)\}/g, function(a, b) {
          var r = o[b];
          return typeof r === 'string' || typeof r === 'number' ? r : a;
        });
      };
    }

    $(function() {
      require(specs, function() {
        jasmine.getEnv().addReporter(new jasmine.HtmlReporter());
        jasmine.getEnv().execute();
      });
    });
  });

})();
