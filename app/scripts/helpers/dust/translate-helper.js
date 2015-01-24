/* global define */

define([
  'underscore',
  'dust',
  'nls/nls',
  'dust.helpers'
], function (_, dust, nls) {
  'use strict';

  dust.helpers.nls = function(chunk, context, bodies, params) {
    var key = dust.helpers.tap(params.key, chunk, context);
    return chunk.write(nls.i18n(key));
  };

  dust.helpers.section = function (chunk, context, bodies, params) {
    var key    = dust.helpers.tap(params.key, chunk, context),
        values = nls.i18n(key),
        trns   = {};

    _(values.length).times(function (n) {
      trns['nls' + (n + 1)] = values[n];
    });

    chunk = chunk.render(bodies.block, context.push(trns));
    return chunk;
  };
});