/* global define */

define([
  'dust',
  'dust.helpers',
  'buses/navigator',
  'models/settings-model'
], function (dust, dustHelpers, Navigator, Settings) {
  'use strict';

  dust.helpers.authorLink = function (chunk, context, bodies, params) {
    var author    = dust.helpers.tap(params.author, chunk, context),
        authorUrl = [Settings.get('site_url'), Navigator.getAuthorLink(author.slug)].join('/');

    return chunk.write(authorUrl);
  };
});