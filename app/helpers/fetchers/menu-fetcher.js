/* global define */

define([
  'jquery',
  'models/settings-model',
], function ($, Settings) {
  'use strict';

  var Menus = function () {
    this.url = Settings.get('api_url') + '/b3:menus';
  };

  Menus.prototype = {
    fetch: function () {
      return $.get(this.url);
    }
  };

  return Menus;
});