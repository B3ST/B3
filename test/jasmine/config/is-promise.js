/* global define */

define([
  'jquery'
], function ($) {
  'use strict';

  function isPromise(value) {
    if (typeof value.then !== 'function') {
      return false;
    }

    var promiseThenSrc = String($.Deferred().then);
    var valueThenSrc = String(value.then);
    return promiseThenSrc === valueThenSrc;
  }

  window.isPromise = isPromise;

  return isPromise;
});