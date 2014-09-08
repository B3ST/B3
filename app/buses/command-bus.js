/* global define */

define([
  'backbone',
  'marionette'
], function (Backbone) {
  'use strict';

  var CommandBus = new Backbone.Wreqr.Commands();
  return CommandBus;
});