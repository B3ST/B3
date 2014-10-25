/* global define */

define([
  'underscore',
  'i18n!nls/i18n'
], function (_, i18n) {
  'use strict';

  var nls = function () {};

  nls.prototype = {
    i18n: function(property) {
      return getProperty(property, i18n);
    }
  };

  function getProperty(propertyName, object) {
    var parts    = propertyName.split('.'),
        length   = parts.length,
        property = object;

    _(length).times(function (n) {
      property = property[parts[n]];
    });

    return property;
  }

  return new nls();
});