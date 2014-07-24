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
  var HeaderView = Backbone.Marionette.ItemView.extend({
    template: 'header-template.dust',
    tagName:  'div class="container"',
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
