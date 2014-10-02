/* global define */

define([
  'jquery',
  'models/settings-model'
], function ($, Settings) {
  'use strict';

  var Sidebars = function() {
    this.url = Settings.get('api_url') + '/b3:sidebars';
  };

  Sidebars.prototype = {
    fetch: function () {
      return $.get(this.url);
    }
  };

  return Sidebars;
});