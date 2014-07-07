define([
  'jquery',
  'backbone',
  'models/user-model'
], function ($, Backbone, User) {
  var Page = Backbone.Model.extend({
    defaults: {
      ID             : null,
      title          : '',
      content        : '',
      date           : '',
      date_gmt       : '',
      modified       : '',
      modified_gmt   : '',
      slug           : '',
      guid           : '',
      excerpt        : '',
      link           : '',
      status         : 'draft',
      type           : 'page',
      format         : 'standard',
      menu_order     : 0,
      comment_status : 'closed',
      ping_status    : 'open',
      sticky         : false,
      terms          : [],
      date_tz        : 'Etc/UTC',
      modified_tz    : 'Etc/UTC',
      author         : {},
      meta           : {}
    },

    idAttribute: 'ID',
    urlRoot: '/pages',

    getAuthor: function () {
      return new User(this.get('author'));
    },
  });

  return Page;
});