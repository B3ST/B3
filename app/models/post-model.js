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
      author         : {},
      content        : '',
      link           : '',
      date           : '',
      date_gmt       : '',
      modified       : '',
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
    urlRoot: '/wp-json/posts',

    getAuthor: function () {
      return new User(this.get('author'));
    }
  });

  return Post;
});