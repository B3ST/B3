define([
  'jquery',
  'backbone',
  'models/user-model'
], function ($, Backbone, User) {
  var Media = Backbone.Model.extend({
    defaults: {
      ID             : null,
      title          : '',
      status         : 'inherit',
      type           : 'attachment',
      author         : {},
      content        : '',
      link           : '',
      date           : '',
      date_gmt       : '',
      modified       : '',
      modified_gmt   : '',
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
      source         : '',
      is_image       : true,
      terms          : [],
      image_meta     : {},
      meta           : {}
    },

    idAttribute: 'ID',
    urlRoot: '/media',

    getAuthor: function () {
      return new User(this.get('author'));
    }
  });

  return Media;
});