/* global define */

define([

], function () {
  'use strict';

  var using = function(name, values, func) {
    for (var i = 0, count = values.length; i < count; i++) {
      if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
        values[i] = [values[i]];
      }
      func.apply(this, values[i]);
    }
  };

  window.using = using;

  return using;
});