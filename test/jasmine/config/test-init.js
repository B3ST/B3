/* global require*/

(function() {
  'use strict';

  var root = '../../../..';
  var config = {
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
      'bootstrap.affix':      root + '/lib/affix',
      'bootstrap.alert':      root + '/lib/alert',
      'bootstrap.button':     root + '/lib/button',
      'bootstrap.carousel':   root + '/lib/carousel',
      'bootstrap.collapse':   root + '/lib/collapse',
      'bootstrap.dropdown':   root + '/lib/dropdown',
      'bootstrap.tab':        root + '/lib/tab',
      'bootstrap.transition': root + '/lib/transition',
      'bootstrap.scrollspy':  root + '/lib/scrollspy',
      'bootstrap.modal':      root + '/lib/modal',
      'bootstrap.tooltip':    root + '/lib/tooltip',
      'bootstrap.popover':    root + '/lib/popover',
      'text':                 root + '/lib/text',
      'jasmine':              root + '/lib/jasmine',
      'jasmine-html':         root + '/lib/jasmine-html',
      'jasmine-jquery':       root + '/lib/jasmine-jquery',
      'boot':                 root + '/lib/boot',
      'sinon':                root + '/lib/sinon',
      'moment':               root + '/lib/moment',
      'i18n':                 root + '/lib/i18n'
    },

    shim: {
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

      'dust.marionette': {
        'deps': ['marionette', 'dust'],
        'exports': 'dustMarionette',
      },

      'dust.helpers': {
        'deps': ['dust'],
        'exports': 'dustHelpers'
      },

      'backbone.validateAll': ['backbone'],

      'bootstrap.affix':      ['jquery'],
      'bootstrap.alert':      ['jquery'],
      'bootstrap.button':     ['jquery'],
      'bootstrap.carousel':   ['jquery'],
      'bootstrap.collapse':   ['jquery'],
      'bootstrap.dropdown':   ['jquery'],
      'bootstrap.tab':        ['jquery'],
      'bootstrap.transition': ['jquery'],
      'bootstrap.scrollspy':  ['jquery'],
      'bootstrap.modal':      ['jquery'],
      'bootstrap.tooltip':    ['jquery'],
      'bootstrap.popover':    ['jquery', 'bootstrap.tooltip'],

      'jasmine': {
        'exports': 'jasmine'
      },

      'jasmine-html': {
        'deps': ['jasmine'],
        'exports': 'jasmine'
      },

      'jasmine-jquery': {
        'deps': ['jasmine', 'jasmine-html'],
        'exports': 'JasmineJquery'
      },

      'boot': {
        'deps': ['jasmine', 'jasmine-html'],
        'exports': 'jasmine'
      },
    }
  };

  require.config(config);

  var specsRoot = '../../../../test/jasmine/specs/';
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
    specsRoot + 'core/collections/base-collection.spec',
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
    specsRoot + 'core/views/comments-view.spec',
    specsRoot + 'core/views/comment-view.spec',
    specsRoot + 'core/views/not-found-view.spec',
    specsRoot + 'core/views/reply-form-view.spec',
    specsRoot + 'core/views/menu-view.spec',
    specsRoot + 'core/views/menu-item-view.spec',
    specsRoot + 'core/views/sidebar-view.spec',
    specsRoot + 'core/views/search-view.spec',
    specsRoot + 'core/views/loading-view.spec',
    specsRoot + 'core/views/pagination-view.spec',

    // helpers
    specsRoot + 'core/helpers/post-filter.spec',

    // controllers
    specsRoot + 'core/controllers/base-controller.spec',
    specsRoot + 'core/controllers/single-controller.spec',
    specsRoot + 'core/controllers/archive-controller.spec',
    specsRoot + 'core/controllers/search-controller.spec',
    specsRoot + 'core/controllers/loading-controller.spec',
    specsRoot + 'core/controllers/pagination-controller.spec',
    specsRoot + 'core/controllers/comments-controller.spec',
    specsRoot + 'core/controllers/reply-form-controller.spec',
    specsRoot + 'core/controllers/header-controller.spec',
    specsRoot + 'core/controllers/menu-controller.spec',
    specsRoot + 'core/controllers/sidebar-controller.spec',
    specsRoot + 'core/controllers/footer-controller.spec',

    specsRoot + 'core/apis/archive-api.spec',
    specsRoot + 'core/apis/single-api.spec',
    specsRoot + 'core/apis/search-api.spec',
    specsRoot + 'core/apis/home-api.spec',

    specsRoot + 'core/buses/navigator.spec',
  ];


  // Include Desktop Specific JavaScript files here (or inside of your Desktop router)
  require([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'boot',
    'models/settings-model',

    'jasmine-jquery',
    'backbone.validateAll',

    'bootstrap.affix',
    'bootstrap.alert',
    'bootstrap.button',
    'bootstrap.carousel',
    'bootstrap.collapse',
    'bootstrap.dropdown',
    'bootstrap.tab',
    'bootstrap.transition',
    'bootstrap.scrollspy',
    'bootstrap.modal',
    'bootstrap.tooltip',
    'bootstrap.popover',

    'config/utils/supplant',
    'config/utils/startsWith',
    'config/utils/endsWith',
    'config/utils/removeAt',
    'helpers/dust/page-iterator-helper',
    'helpers/dust/format-date-helper',
    'helpers/dust/sidebar-widgets-helper',
    'helpers/dust/terms-helper',
    'helpers/dust/translate-helper',
    'helpers/dust/author-link-helper',

    'behaviors/behaviors',

    '../../test/jasmine/config/using',
    '../../test/jasmine/config/stub-server',
    '../../test/jasmine/config/inherits',
    '../../test/jasmine/config/is-promise'
  ], function ($, _, Backbone, Marionette, jasmine, Settings) {

    require(specs, function() {
      jasmine.getJSONFixtures().fixturesPath = 'fixtures/json';
      loadJSONFixtures('routes.json', 'post.json', 'menu_item.json', 'taxonomies.json', 'route.json', 'sidebar.json');
      Settings.set('require.config', config);
      window.onload();
      // jasmine.getEnv().addReporter(new jasmine.HtmlReporter());
      // jasmine.getEnv().execute();
    });
  });
})();
