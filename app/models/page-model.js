define([
  'jquery',
  'backbone',
  'models/user-model',
  'models/settings-model'
], function ($, Backbone, User, Settings) {
  var Page = Backbone.Model.extend({
    defaults: {
      ID             : null,
      title          : '',
      content        : '',
      parent         : 0,
      date           : new Date(),
      date_gmt       : new Date(),
      modified       : new Date(),
      modified_gmt   : new Date(),
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
      author         : new User(),
      meta           : {}
    },

    idAttribute: 'ID',
    urlRoot: Settings.get('url') + '/pages',
  });

  return Page;
});
