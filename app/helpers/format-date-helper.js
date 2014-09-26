/* global define */

define([
  'dust',
  'dust.helpers',
  'moment'
], function (dust, dustHelpers, moment) {
  'use strict';

  dust.helpers.formatDate = function (chunk, context, bodies, params) {
    var date   = dust.helpers.tap(params.date, chunk, context),
        format = dust.helpers.tap(params.format, chunk, context),
        m      = moment(new Date(date)),
        output = m.format(format);

    return chunk.write(output);
  };
});