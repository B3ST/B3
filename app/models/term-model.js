define([
  'jquery',
  'backbone',
  'models/settings-model'
], function ($, Backbone, Settings) {
  var Term = Backbone.Model.extend({
    defaults: {
      ID          : null,
      parent      : null,
      name        : '',
      slug        : '',
      description : '',
      link        : '',
      taxonomy    : 'category',
      count       : 0,
      meta        : {}
    },

    url: function () {
      var tid = this.get('taxonomy') || '',
          id  = this.get('ID') || '';
      return Settings.get('url') + '/taxonomies/' + tid + '/terms/' + id;
    }
  });

  return Term;
});