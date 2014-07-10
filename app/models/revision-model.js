define([
  'jquery',
  'backbone',
  'models/user-model',
  'models/settings-model'
], function ($, Backbone, User, Settings) {
  var Revision = Backbone.Model.extend({
    defaults: {
      ID           : null,
      post         : null,
      title        : '',
      status       : 'inherit',
      type         : 'revision',
      author       : new User(),
      content      : '',
      link         : '',
      parent       : 0,
      date         : new Date(),
      modified     : new Date(),
      date_gmt     : new Date(),
      modified_gmt : new Date(),
      format       : 'standard',
      slug         : null,
      guid         : '',
      excerpt      : '',
      menu_order   : 0,
      meta         : {}
    },

    url: function () {
      var pid = this.get('post') || '',
          rid = this.get('ID') || '';
      return Settings.get('url') + '/posts/' + pid + '/revisions/' + rid;
    }
  });

  return Revision
});