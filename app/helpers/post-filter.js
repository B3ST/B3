/* globals define */

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

    /**
     * Serializes the filter request
     * @return {string} The serialized request
     */
    serialize: function () {
      return decodeURIComponent($.param(this.filter));
    },

    /**
     * Search filter using category term or terms
     * @param  {string|array} category Category term or terms
     * @return {PostFilter}            returns self
     */
    byCategory: function (category) {
      checkStringType(category);
      this.filter.filter.category_name = category;
      return this;
    },

    /**
     * Search filter using category ID or IDs
     * @param  {int|array} cid Category ID or IDs
     * @return {PostFilter}    returns self
     */
    byCategoryId: function (cid) {
      checkIntType(cid);
      this.filter.filter.cat = cid;
      return this;
    },

    /**
     * Search filter using tag name or names
     * @param  {string|array} tag Tag name or names
     * @return {PostFilter}       returns self
     */
    byTag: function (tag) {
      checkStringType(tag);
      this.filter.filter.tag = tag;
      return this;
    },

    /**
     * Search filter using author name or names
     * @param  {string|array} name Author name or names
     * @return {PostFilter}        returns self
     */
    byAuthor: function (name) {
      checkStringType(name);
      this.filter.filter.author_name = name;
      return this;
    },

    /**
     * Search filter using author ID or IDs
     * @param  {int|array} aid Author ID or IDs
     * @return {PostFilter}    returns self
     */
    byAuthorId: function (aid) {
      checkIntType(aid);
      this.filter.filter.author = aid;
      return this;
    },

    /**
     * Search filter for searching terms
     * @param  {string} term Term to search for
     * @return {PostFilter}  returns self
     */
    bySearchingFor: function (term) {
      checkStringType(term);
      this.filter.filter.s = term;
      return this;
    },

    /**
     * Pagination filter
     * @param  {int} page   Page number
     * @return {PostFilter} returns self
     */
    onPage: function (page) {
      checkIntType(page);
      this.filter.page = page;
      return this;
    },

    /**
     * Pagination filter to display a certain amount of results
     * @param  {int} per_page How many results per page
     * @return {PostFilter}   returns self
     */
    perPage: function (per_page) {
      checkIntType(per_page);
      this.filter.filter.posts_per_page = per_page;
      return this;
    },

    /**
     * Pagination filter to display all results
     * @return {PostFilter} returns self
     */
    all: function () {
      this.filter.filter.posts_per_page = -1;
      return this;
    }
  });

  return PostFilter;
});