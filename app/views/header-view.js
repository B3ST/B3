/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'dust',
  'dust.marionette',
  'models/settings-model',
  'models/menu-model',
  'views/menu-view',
  'views/search-view',
  'controllers/event-bus',
  'controllers/navigator',
  'header-template'
], function ($, _, Backbone, dust, dustMarionette, Settings, Menu, MenuView, SearchView, EventBus, Navigator) {
  'use strict';

  var HeaderView = Backbone.Marionette.ItemView.extend({
    template: 'header-template.dust',
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
      this.menuView   = new MenuView({collection: this.model.getItems()});
      this.searchView = new SearchView({});

      this.menuView.render();
      this.searchView.render();

      this.$('#b3-header-nav').append(this.menuView.el)
                              .append(this.searchView.el);
    },

    onDestroy: function () {
      this.menuView.destroy();
      this.searchView.destroy();
    },

    serializeData: function () {
      return Settings.attributes;
    },

    index: function (ev) {
      Navigator.navigateToHome('', null, true);
      EventBus.trigger('menu-item:select', {id: -1});
      ev.preventDefault();
    },

    getItems: function () {
      var menus = this.model.getItems();
      return menus.map(function (menu) {
        return menu.attributes;
      });
    }
  });

  return HeaderView;
});
