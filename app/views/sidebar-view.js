/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'dust',
  'dust.marionette',
  'widget-areas/sidebar-template'
  /*jshint unused:false */
], function ($, _, Backbone, Marionette, dust, dustMarionette) {
  'use strict';

  var SidebarView = Backbone.Marionette.ItemView.extend({
    modelEvents: {
      'change': 'render'
    },

    initialize: function (options) {
      this.model.fetch();
      this.template = options.template || 'widget-areas/sidebar-template.dust';
    },

    serializeData: function () {
      var widgets = this.getModels(this.model.getWidgets());
      return this.getDustHelper(widgets);
    },

    getModels: function (widgets) {
      return widgets.map(function (widget) {
        return widget.toJSON();
      });
    },

    getDustHelper: function (widgets) {
      return {
        widgets: widgets.length,
        sidebar: function (chunk, context, bodies) {
          var idx = context.current();

          _(idx).times(function (index) {
            var widget = widgets[index];
            chunk = chunk.render(bodies.block, context.push({
              title:   widget.widget_title,
              content: widget.widget_content
            }));
          });

          return chunk;
        }
      };
    }
  });

  return SidebarView;
});