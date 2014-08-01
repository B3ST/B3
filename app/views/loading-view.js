/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'controllers/command-bus'
  /* jshint unused: false */
], function ($, _, Backbone, Marionette, CommandBus) {
  'use strict';

  var LoadingView = Backbone.Marionette.ItemView.extend({
    initialize: function () {
      _.bindAll(this, 'show', 'hide');
      CommandBus.setHandler('loading:show', this.show);
      CommandBus.setHandler('loading:hide', this.hide);
    },

    show: function () {
      $('.loading').show();
    },

    hide: function () {
      $('.loading').hide();
    }
  });

  return LoadingView;
});