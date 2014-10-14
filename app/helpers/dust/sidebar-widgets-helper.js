/* global define */

define([
  'underscore',
  'dust',
  'dust.helpers'
], function (_, dust) {
  'use strict';

  dust.helpers.sidebarWidgets = function(chunk, context, bodies, params) {
    var widgets = dust.helpers.tap(params.widgets, chunk, context),
        size = widgets.length;

    _(size).times(function (index) {
      var widget = widgets[index];
      chunk = chunk.render(bodies.block, context.push({
        title:   widget.widget_title,
        content: widget.widget_content
      }));
    });

    return chunk;
  };
});