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
        warning:    ['You are commenting as', 'Not', '?'],
        comment:    ['You comment:', 'You may use these', 'tags and attributes']
      },

      pagination: {
        current: '(current)'
      },

      navigation: {
        search: 'Search for:',
        toggle: 'Toggle navigation'
      },

      search: {
        submit: 'Submit'
      },

      footer: {
        disclaimer: [
          'B3 is a', 'Wordpress', 'starter theme based on', 'Backbone.js', 'and', 'Bootstrap',
          'Assembled in Portugal by', '@goblindegook', '@pcruz7', ' and', '@log_oscon',
          'Licensed under', 'MIT',
          'Alpa',
          'GitHub',
          'Bitbucket',
          'Trello'
        ]
      }
    }
  }
});