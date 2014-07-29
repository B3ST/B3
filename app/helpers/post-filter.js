/* global define */

define([
  'jquery',
  'backbone'
], function ($, Backbone) {
  'use strict';

  function checkStringType (input) {
    if (typeof(input) !== 'string'
          /*&& !(input typeof Array)*/) {
      throw 'Type of input should be either String or Array';
    }
  }

  function checkIntType (input) {
    if (isNaN(input)
          /*&& !(input typeof Array)*/) {
      throw 'Type of input should be either int or Array';
    }
  }

  var PostFilter = Backbone.Model.extend({
    initialize: function () {
      this.filter        = {};
      this.filter.filter = {};
    },

    serialize: function () {
      return decodeURIComponent($.param(this.filter));
    },

    /* Category */
    byCategory: function (category) {
      checkStringType(category);
      this.filter.filter.category_name = category;
      return this;
    },

    byCategoryId: function (cid) {
      checkIntType(cid);
      this.filter.filter.cat = cid;
      return this;
    },

    /* Tags */
    byTag: function (tag) {
      checkStringType(tag);
      this.filter.filter.tag = tag;
      return this;
    },

    /* Pagination and Order */
    onPage: function (page) {
      checkIntType(page);
      this.filter.page = page;
      return this;
    },

    perPage: function (per_page) {
      checkIntType(per_page);
      this.filter.filter.posts_per_page = per_page;
      return this;
    },

    all: function () {
      this.filter.filter.posts_per_page = -1;
      return this;
    }
  });

  return PostFilter;
});