/* global define */

define([
  'jquery',
  'backbone',
  'models/settings-model',
  'collections/term-collection',
], function ($, Backbone, Settings, Terms) {
  'use strict';
  var Taxonomy = Backbone.Model.extend({
    defaults: {
      name         : '',
      slug         : null,
      labels       : {},
      types        : {},
      meta         : {},
      show_cloud   : false,
      hierarchical : false
    },

    idAttribute: 'slug',
    urlRoot: Settings.get('api_url') + '/taxonomies',

    fetchTerms: function (id) {
      id = id || '';
      if ($.isEmptyObject(this.get('meta'))) {
        return false;
      } else {
        var defer = $.Deferred();

        $.get(this.get('meta').links.archives)
          .done(function (data) { defer.resolve(this._getData(id, data)); }.bind(this))
          .fail(function (data) { defer.reject(data); });

        return defer.promise();
      }
    },

    _getData: function (id, data) {
      var init = (id === '' ? Terms : new Terms().model);
      return new init(data);
    }
  });

  return Taxonomy;
});
