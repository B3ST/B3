/* global define */

define([
  'jquery',
  'backbone',
  'collections/revision-collection',
  'collections/comment-collection'
], function ($, Backbone, Revisions, Comments) {
  'use strict';

  var Commentable = Backbone.Model.extend({
    fetchRevisions: function (id) {
      return this._fetchMeta(id, 'version-history', Revisions);
    },

    fetchComments: function (id) {
      return this._fetchMeta(id, 'b3:replies', Comments);
    },

    _fetchMeta: function (id, link, collection) {
      id = id || '';
      if ($.isEmptyObject(this.get('meta'))) {
        return false;
      } else {
        var defer = $.Deferred();

        $.get(this._getMetaUrl(link) + '/' + id)
         .done(function (data) { defer.resolve(this._getData(data, id, collection)); }.bind(this))
         .fail(function () { defer.reject(); });

        return defer.promise();
      }
    },

    _getData: function (data, id, collection) {
      var model = new collection().model;
      if (id === '') {
        data = $.map(data, function(item) {
          return this._createModel(model, item);
        }.bind(this));
        return new collection(data).sort();
      } else {
        return this._createModel(model, data);
      }
    },

    _createModel: function (model, item) {
      var itemModel = model.prototype.parse(item);
      itemModel.post = this;
      return new model(itemModel);
    },

    _getMetaUrl: function (link) {
      return this.get('meta').links[link];
    }
  });

  return Commentable;
});
