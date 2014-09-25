/* global define */

define([
  'dust'
], function (dust) {
  'use strict';

  var Renderer = function () {};

  Renderer.prototype = {
    render: function (template, data) {
      var html;
      // Template must be compiled and in the dust cache. Recommend pre-compiling
      // and loading the templates as scripts at app start.
      dust.render(template, data, function(err, out) {
        html = out;
      });

      return html;
    }
  };

  return new Renderer();
});