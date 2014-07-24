define([
  'jquery',
  'backbone',
  'dust',
  'dust.marionette',
  'models/settings-model',
  'controllers/event-bus',
  'controllers/navigator',
  'header-template',
], function ($, Backbone, dust, dustMarionette, Settings, EventBus, Navigator) {
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
      Navigator.navigate('', true);
      return false;
    }
  });

  return HeaderView;
});
