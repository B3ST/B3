define([
  'jquery',
  'backbone',
  'models/user-model'
], function ($, Backbone, User) {
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

    fetchRevisions: function (id) {
      return this.fetchMeta(id, 'version-history');
    },

    fetchComments: function (id) {
      return this.fetchMeta(id, 'replies');
    },

    fetchMeta: function (id, link) {
      id = id || '';
      return $.isEmptyObject(this.get('meta')) ? false : $.get(this.getMetaUrl(link) + '/' + id);
    },

    getMetaUrl: function (link) {
      return this.get('meta').links[link];
    }
  });

  return Post;
});