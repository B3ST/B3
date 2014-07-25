define([
  'jquery',
  'underscore',
  'backbone',
  'dust',
  'dust.marionette',
  'models/settings-model',
  'models/menu-model',
  'views/menu-view',
  'controllers/event-bus',
  'controllers/navigator',
  'content/content-template',
  'header-template'
], function ($, _, Backbone, dust, dustMarionette, Settings, Menu, MenuView, EventBus, Navigator) {
  'use strict;'

  var HeaderView = Backbone.Marionette.ItemView.extend({
    template: 'content/content-template.dust',
    tagName:  'div',
    events: {
      'click #b3-home': 'index',
    },

    modelEvents: {
      'change': 'render'
    },

    initialize: function (options) {
      this.model = new Menu(options.menus.primary);
      this.model.fetch();
    },

    onRender: function () {
      if (this.menuView) {
        this.menuView.destroy();
      }

      this.menuView = new MenuView({collection: this.model.getItems()});
      this.menuView.render();

      this.$('#b3-header-nav').append(this.menuView.el);
    },

    onDestroy: function () {
      this.menuView.destroy();
    },

    serializeData: function () {
      var items = {items: this.getItems()};
      return _.extend(this.getDustTemplate(), items);
    },

    index: function (ev) {
      this.navigate('');
      EventBus.trigger('menu:item-selected', {id: -1});
      ev.preventDefault();
    },

    getItems: function () {
      var menus = this.model.getItems();
      return menus.map(function (menu) {
        return menu.attributes;
      });
    },

    getDustTemplate: function () {
      return _.extend(Settings.attributes, {'parent-template': 'header-template.dust'});
    },

    navigate: function (route) {
      Navigator.navigate(route, true);
    }
  });

  return HeaderView;
});
