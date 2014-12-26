/* global define */

define([
  'underscore',
  'backbone',
  'marionette',
  'models/menu-item-model',
  'models/settings-model',
  'buses/event-bus',
  'behaviors/menu-item-behavior',
  'behaviors/navigation-behavior',
  'templates/navigation/menus/menu-item-template'
], function (_, Backbone, Marionette, MenuItem, Settings, EventBus) {
  'use strict';

  var MenuItemView = Backbone.Marionette.ItemView.extend({
    template: 'navigation/menus/menu-item-template.dust',

    model: MenuItem,

    tagName:  function () {
      return 'li id="menu-item-' + this.model.get('ID') + '"';
    },

    ui: {
      menuItem: '.menu-item',
      link:     '.menu-item'
    },

    behaviors: {
      MenuItem:   {activeClass: 'active'},
      Navigation: {}
    },

    initialize: function () {
      this.dropdown = false;

      EventBus.on('view:menu:state:change', this.onItemActivation, this);
      EventBus.on('header:view:index', this.onItemActivation, this);
    },

    onDestroy: function () {
      EventBus.off('view:menu:state:change', this.onItemActivation, this);
      EventBus.off('header:view:index', this.onItemActivation, this);
    },

    serializeData: function () {
      return _.extend(this.model.toJSON(), { dropdown: this.dropdown });
    },

    onItemActivation: function (activeItem) {
      // Tell the behaviour to update menu items up the hierarchy:
      this.triggerMethod('MenuItemUpdate', activeItem);
    },

    setDropdown: function () {
      if (!this.dropdown) {
        this.dropdown = true;
        this.render();
        this.$el.addClass('dropdown');
      }
    }
  });

  return MenuItemView;
});
