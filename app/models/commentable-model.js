define([
  'jquery',
  'collections/revision-collection',
  'collections/comment-collection'
], function ($, Revisions, Comments) {
  var Commentable = {
    fetchRevisions: function (callbacks, id) {
      return this.fetchMeta(id, 'version-history', Revisions, callbacks);
    },

    fetchComments: function (callbacks, id) {
      return this.fetchMeta(id, 'replies', Comments, callbacks);
    },

    fetchMeta: function (id, link, collection, callbacks) {
      id = id || '';
      if ($.isEmptyObject(this.get('meta'))) {
        return false;
      } else {
        $.get(this.getMetaUrl(link) + '/' + id).done(function (data) {
            data = this.getData(data, id, collection);
            if (callbacks.done) {
              callbacks.done(data);
            }
          }.bind(this)).fail(function (data) {
            if (callbacks.fail) {
              callbacks.fail(data);
            }
          });
      }
    },

    getData: function (data, id, collection) {
      var model = new collection().model;
      if (id == '') {
        data = $.map(data, function(item, index) {
          return this.createModel(model, item);
        }.bind(this));
        return new collection(data).sort();
      } else {
        return this.createModel(model, data);
      }
    },

    createModel: function (model, item) {
      var m = model.prototype.parse(item);
      m['post'] = this;
      return new model(m);
    },

    getMetaUrl: function (link) {
      return this.get('meta').links[link];
    }
  };

  return Commentable;
});