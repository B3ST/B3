/**
 * RequireJS build configuration.
 */
({

  baseUrl:                 'app',
  dir:                     'dist',
  optimize:                'uglify2',
  findNestedDependencies:  true,
  removeCombined:          true,
  preserveLicenseComments: false,
  generateSourceMaps:      true,

  paths: {
    'jquery':               '../lib/jquery',
    'jqueryui':             '../lib/jquery-ui',
    'underscore':           '../lib/lodash.compat',
    'backbone':             '../lib/backbone',
    'backbone.wreqr':       '../lib/backbone.wreqr',
    'backbone.babysitter':  '../lib/backbone.babysitter',
    'marionette':           '../lib/backbone.marionette',
    'dust':                 '../lib/dust-full.min',
    'dust.helpers':         '../lib/dust-helpers.min',
    'dust.marionette':      '../lib/backbone.marionette.dust',
    'backbone.validateAll': '../lib/Backbone.validateAll.min',
    'bootstrap':            '../lib/bootstrap',
    'bootstrap.notify':     '../lib/bootstrap-notify',
    'text':                 '../lib/text',
    'moment':               '../lib/moment',
    'i18n':                 '../lib/i18n',
    'templates':            'templates-compiled'
  },

  shim: {
      'jqueryui': ['jquery'],
      'bootstrap': ['jquery'],

      'backbone': {
        'deps':    ['underscore'],
        'exports': 'Backbone'
      },

      'marionette': {
        'deps':    ['underscore', 'backbone', 'jquery'],
        'exports': 'Marionette'
      },

      'dust': {
        'exports': 'dust'
      },

      'dust.helpers': {
        'deps':    ['dust'],
        'exports': 'dustHelpers'
      },

      'dust.marionette': {
        'deps':    ['marionette', 'dust'],
        'exports': 'dustMarionette',
      },

      'templates': {
        'deps': ['dust']
      },

      'backbone.validateAll': ['backbone'],
      'bootstrap.notify':     ['bootstrap'],
  },

  modules: [
    {
      name: 'main',
      exclude: [
        'infrastructure'
      ]
    },
    {
      name: 'infrastructure'
    }
  ]
})
