/* global define */

define([
  'underscore',
  'backbone',
  'models/base-model',
  'models/user-model',
  'models/settings-model',
  'models/term-model'
], function (_, Backbone, BaseModel, User, Settings, Term) {
  'use strict';

  var Post = BaseModel.extend({
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
    urlRoot: Settings.get('api_url') + '/posts',

    url: function () {
      var query = '';

      if (this.get('ID')) {
        query = '/' + this.get('ID');
      } else {
        query = '/b3:slug:' + this.get('slug');
      }

      return this.urlRoot + query;
    },

    getTerm: function (taxonomy, term) {
      var terms = this.get('terms')[taxonomy],
          index = _.findIndex(terms, function (elem) {
            return elem.slug === term;
          });

      return index > -1 ? new Term(terms[index]) : new Term();
    }
  });

  return Post;
});
