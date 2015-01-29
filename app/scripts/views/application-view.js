/* global define */
define([
  'backbone'
], function (Backbone) {
  'use strict';

  var AppView = Backbone.Marionette.LayoutView.extend({
    el:       'body',
    template: false,

    regions: {
      header:  '#header',
      main:    '#main',
      sidebar: '#sidebar',
      footer:  '#footer'
    }
  });

  return AppView;
});
