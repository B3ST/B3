define([
  'jquery',
  'backbone',
  'dust',
  'dust.marionette',
  'models/settings-model',
  'controllers/event-bus',
  'views/header-view-template',
], function ($, Backbone, dust, dustMarionette, Settings, EventBus) {
  var HeaderView = Backbone.Marionette.ItemView.extend({
    template: 'views/header-view-template.dust',
    tagName:  'div class="container"',
    events: {
      'click .b3-h': 'index'
    },

    serializeData: function () {
      return Settings.attributes;
    },

    index: function (e) {
      EventBus.trigger('router:nav', {route: '', options: {trigger: true}});
      return false;
    }
  });

  return HeaderView;
});