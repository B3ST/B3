define([
  'jquery',
  'backbone',
  'dust',
  'models/settings-model',
  'controllers/event-bus',
  'header-view-template',
], function ($, Backbone, dust, Settings, EventBus) {
  var HeaderView = Backbone.View.extend({
    events: {
      'click .b3-h': 'index'
    },

    render: function () {
      dust.render("views/header-view-template.dust", Settings.attributes, function (err, out) {
        this.setElement(out);
      }.bind(this));

      return this;
    },

    index: function (e) {
      EventBus.trigger('router:nav', {route: '', options: {trigger: true}});
    }
  });

  return HeaderView;
});