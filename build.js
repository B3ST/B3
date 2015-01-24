/**
 * RequireJS build configuration.
 */
({

  baseUrl:                 'app/scripts',
  dir:                     'dist/scripts',
  optimize:                'uglify2',
  findNestedDependencies:  true,
  removeCombined:          true,
  preserveLicenseComments: false,
  generateSourceMaps:      false,
  keepBuildDir:            false,
  wrapShim:                true,

  paths: {
    'jquery':               '../../lib/jquery',
    'jqueryui':             '../../lib/jquery-ui',
    'underscore':           '../../lib/lodash.compat',
    'backbone':             '../../lib/backbone',
    'backbone.wreqr':       '../../lib/backbone.wreqr',
    'backbone.babysitter':  '../../lib/backbone.babysitter',
    'marionette':           '../../lib/backbone.marionette',
    'dust':                 '../../lib/dust-full.min',
    'dust.helpers':         '../../lib/dust-helpers.min',
    'dust.marionette':      '../../lib/backbone.marionette.dust',
    'backbone.validateAll': '../../lib/Backbone.validateAll.min',
    'bootstrap':            '../../lib/bootstrap',
    'bootstrap.notify':     '../../lib/bootstrap-notify',
    'text':                 '../../lib/text',
    'moment':               '../../lib/moment',
    'i18n':                 '../../lib/i18n'
  },

  shim: {
      'jqueryui':             ['jquery'],
      'bootstrap':            ['jquery'],
      'backbone':             ['underscore'],
      'marionette':           ['underscore', 'backbone', 'jquery'],
      'dust.helpers':         ['dust'],
      'dust.marionette':      ['marionette', 'dust'],
      'backbone.validateAll': ['backbone'],
      'bootstrap.notify':     ['bootstrap'],
      'templates':            ['dust'],
      'dust':                 {'exports': 'dust'}
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
