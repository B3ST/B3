define([
  'jquery',
  'underscore',
  'backbone',
  'dust',
  'dust.marionette',
  'models/settings-model',
  'models/menu-model',
  'controllers/event-bus',
  'controllers/navigator',
  'content/content-template',
  'header-template'
], function ($, _, Backbone, dust, dustMarionette, Settings, Menu, EventBus, Navigator) {
  'use strict';

  var HeaderView = Backbone.Marionette.ItemView.extend({
    template: 'content/content-template.dust',
    tagName:  'div',
    events: {
      'click #b3-home': 'index',
      'click .b3-menu': 'menu'
    },

    modelEvents: {
      'change': 'render'
    },

    initialize: function (options) {
      this.model = new Menu(options.menus.primary);
      this.model.fetch();
    },

    serializeData: function () {
      var items = {items: this.getItems()};
      return _.extend(this.getDustTemplate(), items);
    },

    index: function (ev) {
      this.toggleActive(ev.currentTarget);
      this.navigate('');
      ev.preventDefault();
    },

    menu: function (ev) {
      var link  = ev.currentTarget.href,
          route = link.split(Settings.get('path') + '/')[1];

      this.toggleActive(ev.currentTarget);
      Navigator.navigate(route, true);
      ev.preventDefault();
    },

    getItems: function () {
      var menus = this.model.getItems();
      return _.map(menus.models, function (menu) {
        return menu.attributes;
      });
    },

    getDustTemplate: function () {
      return _.extend(Settings.attributes, {'parent-template': 'header-template.dust'});
    },

    toggleActive: function (link) {
      this.$('.active').removeClass('active');
      $(link).parent().addClass('active');
    },

    navigate: function (route) {
      Navigator.navigate(route, true);
    }
  });

  return HeaderView;
});
