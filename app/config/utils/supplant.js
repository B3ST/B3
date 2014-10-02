/* global define */

define([ ], function () {
  'use strict';

  if (!String.prototype.supplant) {
    String.prototype.supplant = function(o) {
      return this.replace(/\{([^{}]*)\}/g, function(a, b) {
        var r = o[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
      });
    };
  }
});