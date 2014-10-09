/* global define */

define([
  'backbone',
  'models/base-model',
  'models/user-model',
  'models/settings-model'
], function (Backbone, BaseModel, User, Settings) {
  'use strict';

  var Media = BaseModel.extend({
    defaults: {
      ID             : null,
      title          : '',
      status         : 'inherit',
      type           : 'attachment',
      parent         : 0,
      author         : new User(),
      content        : '',
      link           : '',
      date           : new Date(),
      date_gmt       : new Date(),
      modified       : new Date(),
      modified_gmt   : new Date(),
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
    urlRoot: Settings.get('api_url') + '/media'
  });

  return Media;
});
