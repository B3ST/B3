/* global define */

define([
  'backbone',
  'marionette'
], function (Backbone) {
  'use strict';

  var RequestBus = new Backbone.Wreqr.RequestResponse();
  return RequestBus;
});