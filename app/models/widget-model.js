/* global define */

define([
  'jquery',
  'backbone'
], function ($, Backbone) {
  'use strict';

  var Widget = Backbone.Model.extend({
    defaults: {
      widget_id:      '',
      widget_name:    '',
      widget_title:   '',
      widget_content: '',
      class:          []
    }
  });

  return Widget;
});