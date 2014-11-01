/* global define */

define({
  // 'pt-pt': true, > and add the following folders pt > pt > i18n.js
  // 'es-es': true  > and add the following folders es > es > i18n.js
  root: {
    b3: {
      meta: {
        published: 'Published on',
        by:        'By',
        on:        'on'
      },

      archive: {
        title: 'Archive:',
        total: 'Total:'
      },

      notfound: {
        warning: [
          'Sorry, but the page you were trying to view does not exist.',
          'It looks like this was the result of either:',
          'a mistyped address',
          'an out-of-date link'
        ]
      },

      comments: {
        name:       'Your name:',
        email:      'Your email:',
        site:       'Your site:',
        disclaimer: 'Your email address will not be published.',
        publish:    'Publish Comment',
        dismiss:    'Dismiss',
        reply:      'Reply',
        moderation: 'Your comment is awaiting moderation.',
        warning:    ['You are commenting as', 'Not'],
        comment:    [
          'Your comment:',
          'You may use these <abbr title="HyperText Markup Language">HTML</abbr> tags and attributes:'
        ]
      },

      pagination: {
        current: '(current)'
      },

      navigation: {
        search: 'Search for:',
        toggle: 'Toggle navigation',
        terms:  'Enter search terms'
      },

      search: {
        submit: 'Submit'
      },

      footer: {
        disclaimer: [
          'B3 is a <a href="http://wordpress.org/">WordPress</a> starter theme based on <a href="http://backbonejs.org/">Backbone.js</a> and <a href="http://getbootstrap.com/">Bootstrap</a>.',
          'Assembled in Portugal by <a href="https://twitter.com/goblindegook">@goblindegook</a>, <a href="https://github.com/pcruz7">@pcruz7</a> and <a href="https://twitter.com/log_oscon">@log_oscon</a>.',
          'Licensed under <a href="https://github.com/b3st/b3/blob/master/LICENSE">MIT</a>.',
          'Alpa',
          'GitHub'
        ]
      }
    }
  }
});
