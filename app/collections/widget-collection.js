/* global define */

define([
  'jquery',
  'backbone',
  'models/widget-model'
], function ($, Backbone, Widget) {
  'use strict';

  var Widgets = Backbone.Collection.extend({
    model: Widget
  });

  return Widgets;
});