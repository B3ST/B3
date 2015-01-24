/* global define */

define([
  'underscore',
  'moment'
], function (_, moment) {
  'use strict';

  var mapParameter = {
    year:     'YYYY',
    monthnum: 'MMMM',
    day:      'Do'
  }, ArchiveHeader = function () {};

  function getDate (options) {
    return {
      years:  parseInt(options.year, 10),
      months: parseInt(options.monthnum, 10) - 1,
      days:   parseInt(options.day, 10)
    };
  }

  function convertDate (options) {
    return _.omit(getDate(options), function (value) {
      return isNaN(value);
    });
  }

  function getFormat (options) {
    return _(_.keys(options)).reverse().map(function (value) {
      return mapParameter.hasOwnProperty(value) ? mapParameter[value] : null;
    }).compact().join(' ');
  }

  ArchiveHeader.prototype = {
    archiveType: {
      taxonomy: function (posts, options) {
        return posts.at(0).getTerm(options.taxonomy, options.term).toJSON();
      },

      author: function (posts) {
        return posts.at(0).get('author').toJSON();
      },

      date: function (posts, options) {
        var date = convertDate(options.date);
        return { date: moment(date).format(getFormat(options.date)) };
      }
    },

    archiveBy: function (posts, options) {
      options = options || {};
      if (options.archiveBy && this.archiveType.hasOwnProperty(options.archiveBy)) {
        return this.archiveType[options.archiveBy](posts, options);
      }

      return false;
    }
  };

  return new ArchiveHeader();
});