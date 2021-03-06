/* global define */

define([
  'backbone',
  'models/base-model',
  'models/user-model',
  'models/settings-model',
], function (Backbone, BaseModel, User, Settings) {
  'use strict';

  var Page = BaseModel.extend({
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
    urlRoot: Settings.get('api_url') + '/pages',

    url: function () {
      return this.get('ID') ? (this.urlRoot + '/' + this.get('ID'))
                            : (this.urlRoot + '/' + this.get('slug'));
    }
  });

  return Page;
});
