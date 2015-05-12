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
    'underscore':           '../../lib/lodash.compat',
    'backbone':             '../../lib/backbone',
    'backbone.wreqr':       '../../lib/backbone.wreqr',
    'backbone.babysitter':  '../../lib/backbone.babysitter',
    'marionette':           '../../lib/backbone.marionette',
    'dust':                 '../../lib/dust-full.min',
    'dust.helpers':         '../../lib/dust-helpers.min',
    'dust.marionette':      '../../lib/backbone.marionette.dust',
    'backbone.validateAll': '../../lib/Backbone.validateAll.min',
    'bootstrap.affix':      '../../lib/affix',
    'bootstrap.alert':      '../../lib/alert',
    'bootstrap.button':     '../../lib/button',
    'bootstrap.carousel':   '../../lib/carousel',
    'bootstrap.collapse':   '../../lib/collapse',
    'bootstrap.dropdown':   '../../lib/dropdown',
    'bootstrap.tab':        '../../lib/tab',
    'bootstrap.transition': '../../lib/transition',
    'bootstrap.scrollspy':  '../../lib/scrollspy',
    'bootstrap.modal':      '../../lib/modal',
    'bootstrap.tooltip':    '../../lib/tooltip',
    'bootstrap.popover':    '../../lib/popover',
    'text':                 '../../lib/text',
    'moment':               '../../lib/moment',
    'i18n':                 '../../lib/i18n'
  },

  shim: {
      'backbone':             ['underscore'],
      'marionette':           ['underscore', 'backbone', 'jquery'],
      'dust.helpers':         ['dust'],
      'dust.marionette':      ['marionette', 'dust'],
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
