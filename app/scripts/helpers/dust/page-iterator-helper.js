/* global define */

define([
  'underscore',
  'dust',
  'dust.helpers'
], function (_, dust) {
  'use strict';

  dust.helpers.pageIterator = function(chunk, context, bodies, params) {
    var size = dust.helpers.tap(params.size, chunk, context),
        ctx = context.current();

    _(size).times(function(n) {
      var page = n + 1;
      chunk = chunk.render(bodies.block, context.push({
        'page':    page,
        'url':     '#', // this._getRoute(page), TODO: put route here
        'current': ctx.page === page
      }));
    });

    return chunk;
  };
});