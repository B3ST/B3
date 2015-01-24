/* global define */

define([

], function () {
  'use strict';

  if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (str){
      return this.slice(-str.length) === str;
    };
  }
});