/* global define */

define([

], function () {
  'use strict';

  var ArchiveHeader = function () {};

  ArchiveHeader.prototype = {
    archiveType: {
      taxonomy: function (posts, options) {
        return posts.at(0).getTerm(options.taxonomy, options.term);
      },

      author: function (posts) {
        return posts.at(0).get('author');
      },

      date: function () {
        return new Date();
      }
    },

    archiveBy: function (posts, options) {
      if (options.archiveBy && this.archiveType.hasOwnProperty(options.archiveBy)) {
        return this.archiveType[options.archiveBy](posts, options);
      }

      return null;
    }
  };

  return new ArchiveHeader();
});