define([
  'jquery',
  'backbone',
  'collections/term-collection'
], function ($, Backbone, Terms) {
  var Taxonomy = Backbone.Model.extend({
    defaults: {
      name         : '',
      slug         : null,
      labels       : {},
      types        : {},
      meta         : {},
      show_cloud   : false,
      hierarchical : false
    },

    idAttribute: 'slug',
    urlRoot: '/taxonomies',

    fetchTerms: function (callbacks, id) {
      id = id || '';
      if ($.isEmptyObject(this.get('meta'))) {
        return false;
      } else {
        $.get(this.get('meta').links.archives)
          .done(function (data) {
            var init = (id == '' ? Terms : new Terms().model);
            if (callbacks.done) {
              callbacks.done(new init(data));
            }
          })
          .fail(function (data) {
            if (callbacks.fail) {
              callbacks.fail(data);
            }
          });
      }
    }
  });

  return Taxonomy;
});