/* global define */

define([
  'underscore',
  'backbone',
  'marionette',
  'controllers/archive-controller',
  'buses/event-bus',
  'models/settings-model',
  'helpers/post-filter'
], function (_, Backbone, Marionette, ArchiveController, EventBus, Settings, PostFilter) {
  'use strict';

  var ArchiveAPI = Backbone.Marionette.Controller.extend({
    initialize: function (options) {
      this.taxonomies = options.taxonomies;
      EventBus.on('archive:show', this.showArchive, this);
    },

    showArchive: function (params) {
      var page   = this._getPage(params),
          filter = new PostFilter().onPage(page);

      this._showArchive(page, filter);
    },

    showPostByCategory: function (params) {
      var page   = this._getPage(params),
          catg   = params.category,
          filter = new PostFilter().byCategory(catg).onPage(page);

      this._showArchive({ page: page, filter: filter, opts: { archiveBy: 'taxonomy', taxonomy: 'category', term: catg }});
    },

    showPostByTag: function (params) {
      var page   = this._getPage(params),
          ptag   = params.post_tag,
          filter = new PostFilter().byTag(ptag).onPage(page);

      this._showArchive({ page: page, filter: filter, opts: { archiveBy: 'taxonomy', taxonomy: 'post_tag', term: ptag }});
    },

    showPostByAuthor: function (params) {
      var page   = this._getPage(params),
          author = params.author,
          filter = new PostFilter().byAuthor(author).onPage(page);

      this._showArchive({ page: page, filter: filter, opts: { archiveBy: 'author', author: author }});
    },

    showPostByDate: function (params) {
      var page   = this._getPage(params),
          filter = new PostFilter().withDate(params).onPage(page);

      this._showArchive({ page: page, filter: filter, opts: { archiveBy: 'date', date: params }});
    },

    showPostByTaxonomy: function (params) {
      var page   = this._getPage(params), taxonomy, filter, type;

      params   = _.omit(params, 'paged');
      taxonomy = _.keys(params)[0];
      type     = _.keys(this.taxonomies.findWhere({ slug: taxonomy }).get('types'))[0];
      filter   = new PostFilter().withTaxonomy(params).byType(type);

      this._showArchive({ page: page, filter: filter, template: '', opts: { archiveBy: 'taxonomy', taxonomy: taxonomy, term: params[taxonomy] } });
    },

    _showArchive: function (options) {
      new ArchiveController({ page: options.page, filter: options.filter, template: options.template }).showArchive(options.opts);
    },

    _getPage: function (params) {
      return parseInt(params.paged, 10) || 1;
    }
  });

  return ArchiveAPI;
});