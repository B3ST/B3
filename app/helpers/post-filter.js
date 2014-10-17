/* global define */

define([
  'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
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
    defaults: {
      'paging-schema': 'url'
    },

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
     * Search filter using year
     * @param  {string|array} year Year
     * @return {PostFilter}        returns self
     */
    withYear: function (year) {
      checkStringType(year);
      this.filter.filter.year = year;
      return this;
    },

    /**
     * Search filter using month
     * @param  {string|array} month Month
     * @return {PostFilter}         returns self
     */
    withMonth: function (month) {
      checkStringType(month);
      this.filter.filter.month = month;
      return this;
    },

    /**
     * Search filter using day
     * @param  {string|array} day Day
     * @return {PostFilter}       returns self
     */
    withDay: function (day) {
      checkStringType(day);
      this.filter.filter.day = day;
      return this;
    },

    /**
     * Search filter using the specified parameters
     * @param  {Object} options Object containing the day, monthnum and/or year
     * @return {PostFilter}            returns self
     */
    withDate: function (options) {
      if (options.hasOwnProperty('year')) {
        this.withYear(options.year);
      }

      if (options.hasOwnProperty('monthnum')) {
        this.withMonth(options.monthnum);
      }

      if (options.hasOwnProperty('day')) {
        this.withDay(options.day);
      }

      return this;
    },

    /**
     * Search filter using the specified taxonomy and term
     * @param  {Object} options Object containing the taxonomy (key) and term (value)
     * @return {PostFilter}            returns self
     */
    withTaxonomy: function (options) {
      _(options).keys().each(function (key) {
        this.filter.filter.taxonomy = key;
        this.filter.filter.term     = options[key];
      }.bind(this));

      return this;
    },

    /**
     * Search filter using type
     * @param  {string} type A string containing the type
     * @return {PostFilter}  returns self
     */
    byType: function (type) {
      checkStringType(type);
      this.filter.type = type;
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
