define([
  'jquery',
  'backbone',
  'dust',
  'models/settings-model',
  'controllers/event-bus',
  'views/header-view-template',
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
      e.preventDefault();
      e.stopPropagation();
      EventBus.trigger('router:nav', {route: '', options: {trigger: true}});
    }
  });

  return HeaderView;
});