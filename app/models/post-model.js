define([
  'jquery',
  'backbone',
  'models/user-model',
  'collections/comment-collection',
  'collections/revision-collection'
], function ($, Backbone, User, Comments, Revisions) {
  var Post = Backbone.Model.extend({
    defaults: {
      ID             : null,
      title          : '',
      status         : 'draft',
      type           : 'post',
      parent         : 0,
      author         : new User(),
      content        : '',
      link           : '',
      date           : new Date(),
      date_gmt       : new Date(),
      modified       : new Date(),
      format         : 'standard',
      slug           : '',
      guid           : '',
      excerpt        : '',
      menu_order     : 0,
      comment_status : 'open',
      ping_status    : 'open',
      sticky         : false,
      date_tz        : 'Etc/UTC',
      modified_tz    : 'Etc/UTC',
      featured_image : null,
      terms          : {},
      post_meta      : {},
      meta           : {}
    },

    idAttribute: 'ID',
    urlRoot: '/posts',

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
            var init = (id == '' ? collection : new collection().model);
            if (callbacks.done) {
              callbacks.done(new init(data));
            }
          }).fail(function (data) {
            if (callbacks.fail) {
              callbacks.fail(data);
            }
          });
      }
    },

    getMetaUrl: function (link) {
      return this.get('meta').links[link];
    }
  });

  return Post;
});