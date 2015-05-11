/* global module */

var debug = true,
    src   = 'app/',
    dest  = 'dist/',
    test  = 'test/',
    lib   = 'lib/',
    bower = 'bower_components/';

module.exports = {
  debug: debug,
  src:   src,
  dest:  dest,
  lib:   lib,

  browserSync: {
    proxy:  'b3.dev',
    notify: true,
    files:  [
      '**/*.php',
      dest + '**',
      '!' + test + '**/*',              // Exclude PHPUnit tests
      '!**/*.map'                       // Exclude sourcemaps
    ]
  },

  jasmine: {
    runner: 'test/jasmine/config/test-init.js',
    specs:  'test/jasmine/specs/**/*.spec.js',
    browserSync: {
      notify:    true,
      port:      3002,
      server:    '.',
      startPath: '/test/jasmine/SpecRunner.html',
      files:     [
        dest + '**',
        test + 'jasmine/**',
        '!**/*.map'                     // Exclude sourcemaps
      ]
    }
  },

  scripts: {
    src:  [
      src + 'scripts/**/*.js',
      '!' + src + 'scripts/templates/**/*'
    ],
    dest: dest + 'scripts/'
  },

  dust: {
    src:  src + 'templates/**/*.{html,dust}',
    dest: src + 'scripts/templates/'
  },

  sass: {
    src:      src + 'styles/scss/style.scss',
    dest:     dest + 'styles/',
    settings: {
      sourceComments: debug ? 'map' : null,
      imagePath:      dest + 'images',
      includePaths:   []
    }
  },

  images: {
    src:  src + 'images/**/*',
    dest: dest + 'images/'
  },

  fonts: {
    src:  [
      src + 'fonts/**/*.{eot,svg,ttf,woff}',
      bower + 'bootstrap-sass/assets/fonts/**/*.{eot,svg,ttf,woff}'
    ],
    dest: dest + 'fonts/'
  },

  phpunit: {
    src: 'test/phpunit/**/test*.php'
  },

  coverage: {
    instrument: {
      pattern: ['**/*.spec.js'],
      debugDirectory: 'debug'
    },
    report: {
      outFile: 'test/jasmine/coverage.html'
    }
  },

  jshint: {
    src: [
      src + 'scripts/**/*.js',
      '!' + src + 'scripts/templates/**/*'
    ],
    reporter: 'jshint-stylish'
  },

  autoprefixer: {
    browsers: [
      'last 2 version',
      'ie >= 9',
      'ie_mob >= 10',
      'ff >= 30',
      'chrome >= 34',
      'safari >= 7',
      'opera >= 23',
      'ios >= 7',
      'android >= 4.4',
      'bb >= 10'
    ]
  },
};
