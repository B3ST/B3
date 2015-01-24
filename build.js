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
  keepBuildDir:            true,
  wrapShim:                true,

  // Exclude non-JS files.
  // TODO: In the future, consider moving all JS sources to a common directory.
  fileExclusionRegExp: /^\.|^README$|\.(map|css|less|sass|scss|jpg|jpeg|png|gif|ico|dust|svg|ttf|otf|eot|woff)$/i,

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
