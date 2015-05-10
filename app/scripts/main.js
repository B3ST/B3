/* global WP_API_SETTINGS, require */

(function() {
  'use strict';

  var root = WP_API_SETTINGS.root_url;

  var config = {
    //urlArgs: 'bust=' + (new Date()).getTime(),
    baseUrl: root + '/dist/scripts',

    paths: {
      'jquery':               root + '/lib/jquery',
      'underscore':           root + '/lib/lodash.compat',
      'backbone':             root + '/lib/backbone',
      'backbone.wreqr':       root + '/lib/backbone.wreqr',
      'backbone.babysitter':  root + '/lib/backbone.babysitter',
      'marionette':           root + '/lib/backbone.marionette',
      'dust':                 root + '/lib/dust-full.min',
      'dust.helpers':         root + '/lib/dust-helpers.min',
      'dust.marionette':      root + '/lib/backbone.marionette.dust',
      'backbone.validateAll': root + '/lib/Backbone.validateAll.min',
      'bootstrap':            root + '/lib/bootstrap',
      'bootstrap.notify':     root + '/lib/bootstrap-notify',
      'text':                 root + '/lib/text',
      'moment':               root + '/lib/moment',
      'i18n':                 root + '/lib/i18n'

      //'templates':            'templates-compiled'
    },

    shim: {
      'bootstrap': ['jquery'],
      'backbone': {
        'deps': ['underscore'],
        'exports': 'Backbone'
      },
      'marionette': {
        'deps': ['underscore', 'backbone', 'jquery'],
        'exports': 'Marionette'
      },
      'dust': {
        'exports': 'dust'
      },
      'dust.helpers': {
        'deps': ['dust'],
        'exports': 'dustHelpers'
      },
      'dust.marionette': {
        'deps': ['marionette', 'dust'],
        'exports': 'dustMarionette',
      },

      // Backbone.validateAll plugin (https://github.com/gfranko/Backbone.validateAll)
      'backbone.validateAll': ['backbone'],
      'bootstrap.notify': ['bootstrap'],
    }
  };

  // Includes WordPress scripts
  for (var handle in WP_API_SETTINGS.scripts) {
    if (WP_API_SETTINGS.scripts[handle]) {
      var script           = WP_API_SETTINGS.scripts[handle];
      config.paths[handle] = WP_API_SETTINGS.site_url + script.src;
      config.shim[handle]  = ['app'].concat(script.deps || []);
    }
  }

  require.config(config);

  // Ensure the infrastructure is loaded first:
  require(['infrastructure'], function () {

    // Includes Desktop Specific JavaScript files here (or inside of your Desktop router)
    require([
      'app',
      'config/initializer',
      'config/heartbeat',
      'models/settings-model',

      'config/backbone/sync',
      'config/backbone/routes',
      'config/utils/supplant',
      'config/utils/startsWith',
      'config/utils/endsWith',
      'config/utils/removeAt',
      'config/fetch',
      'config/save',

      'helpers/dust/page-iterator-helper',
      'helpers/dust/format-date-helper',
      'helpers/dust/sidebar-widgets-helper',
      'helpers/dust/terms-helper',
      'helpers/dust/translate-helper',
      'helpers/dust/author-link-helper'
    ], function (App, Initializer, Heartbeat, Settings) {
      Settings.set('require.config', config);
      new Initializer({ app: App }).init();

      var scripts = Object.keys(WP_API_SETTINGS.scripts);
      require(scripts, function () {
        new Heartbeat();
      });

      window.App = App;
    });

  });
})();
