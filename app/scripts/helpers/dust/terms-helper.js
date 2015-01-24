/* global define */

define([
  'underscore',
  'dust',
  'dust.helpers'
], function (_, dust) {
  'use strict';

  dust.helpers.terms = function (chunk, context, bodies, params) {
    var terms  = dust.helpers.tap(params.terms, chunk, context),
        keys   = _(terms).omit(function (value, key) {
          return key === 'post_tag' || key === 'category';
        }).keys().value();

    _.each(keys, function (key) {
      _.each(terms[key], function (term) {
        chunk = chunk.render(bodies.block, context.push(term));
      });
    });

    return chunk;
  };
});