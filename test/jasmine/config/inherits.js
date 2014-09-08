/* global define */

define([
  'underscore'
], function (_) {
  'use strict';

  var inherits = function(child, parent) {
    if (!_.isFunction(child) || !_.isFunction(parent)) {
      throw new Error('`child` and `parent` must be functions.');
    }

    return _.reduce(Object.getPrototypeOf(child.prototype), function(memo, child_prototype__proto__) {
      return _.contains(parent.prototype, child_prototype__proto__) && memo;
    }, true);
  };

  /* global window */
  window.inherits = inherits;

  return inherits;
});