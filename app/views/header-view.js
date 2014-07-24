define([
  'jquery',
  'backbone',
  'dust',
  'dust.marionette',
  'models/settings-model',
  'controllers/event-bus',
  'header-template'
], function ($, Backbone, dust, dustMarionette, Settings, EventBus) {
  'use strict';

  var HeaderView = Backbone.Marionette.ItemView.extend({
    template: 'header-template.dust',
    tagName:  'div',
    events: {
      'click #b3-header': 'index'
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
