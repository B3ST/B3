/* global define */

define([
  'jquery',
  'backbone',
  'models/page-model',
  'models/settings-model'
], function ($, Backbone, Page, Settings) {
  'use strict';
  var Pages = Backbone.Collection.extend({
    model: Page,
    url: Settings.get('apiUrl') + '/pages'
  });

  return Pages;
});
