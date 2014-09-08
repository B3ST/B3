/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'buses/request-bus'
], function ($, _, Backbone, Marionette, RequestBus) {
  'use strict';

  return Marionette.Controller.extend({
    initialize: function (options) {
      this.taxonomies = options.taxonomies;
      this.types      = {};
      this._bindToRequests();
    },

    /**
     * Binds to a given set of events
     */
    _bindToRequests: function () {
      _.bindAll(this, 'getTaxonomy');
      RequestBus.setHandler('taxonomy:get', this.getTaxonomy);
    },

    /**
     * Returns a given taxonomy
     * @param  {Object} params Object containing the taxonomy and term
     * @return {Taxonomy}      A Taxonomy with the given taxonomy and term
     */
    getTaxonomy: function (params) {
      var defer    = $.Deferred(),
          taxonomy = this.taxonomies.findWhere({slug: params.taxonomy});

      taxonomy.fetchTerms()
              .done(function (taxonomies) {
                var taxonomy = taxonomies.findWhere({slug: params.term});
                defer.resolve(taxonomy);
              })
              .fail(function (data) { defer.reject(data); });

      return defer;
    }
  });
});