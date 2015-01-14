/* global define */

define([], function () {
  'use strict';

  if (typeof String.prototype.removeAt !== 'function') {
    String.prototype.removeAt = function (index) {
      return this.slice(0, index) + this.slice(index + 1);
    };
  }
});