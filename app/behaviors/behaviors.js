/* global define */

define([
  'backbone',
  'marionette'
], function (Backbone, Marionette) {
  'use strict';

  window.Behaviors = {};

  Marionette.Behaviors.behaviorsLookup = function() {
    return window.Behaviors;
  };
});
