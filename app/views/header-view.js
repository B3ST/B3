define([
  'jquery',
  'backbone',
  'dust',
  'models/settings-model',
  'controllers/event-bus',
  'text!templates/views/header-view-template.html'
], function ($, Backbone, dust, Settings, EventBus, HeaderViewTemplate) {
  var HeaderView = Backbone.View.extend({
    events: {
      'click .navbar-brand': 'index'
    },

    render: function () {
      var compiled = dust.compile(HeaderViewTemplate, "render:header");
      dust.loadSource(compiled);

      dust.render("render:header", Settings.attributes, function (err, out) {
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