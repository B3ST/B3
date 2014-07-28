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
    "navigation/menus/menu-item-template"
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
    "models/user-model",
    "bootstrap",
    "backbone.validateAll"
  ], function($, _, Backbone, Marionette, jasmine, Settings, User) {
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

      // helpers
      root + 'core/helpers/post-filter.spec',

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

      if (_.isObject(this.get('author'))) {
        attributes.author = this.get('author').attributes;
      }

      return attributes;
    };

    Backbone.Model.prototype.parse = function(response) {
      _.each(parseable_dates, function(key) {
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

})();
