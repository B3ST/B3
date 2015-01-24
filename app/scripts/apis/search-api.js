/* global define */

define([
  'backbone',
  'marionette',
  'buses/command-bus'
], function (Backbone, Marionette, CommandBus) {
  'use strict';

  var SearchAPI = Backbone.Marionette.Controller.extend({
    showSearch: function (params) {
      CommandBus.execute('search:term', params);
    }
  });

  return SearchAPI;
});