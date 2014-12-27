/* global define */

define([
  'underscore',
  'backbone',
  'marionette',
  'models/menu-item-model',
  'behaviors/menu-item-behavior',
  'behaviors/navigation-behavior',
  'templates/navigation/menus/menu-item-template'
], function (_, Backbone, Marionette, MenuItem) {
  'use strict';

  var MenuItemView = Backbone.Marionette.ItemView.extend({
    template: 'navigation/menus/menu-item-template.dust',

    model: MenuItem,

    tagName:  function () {
      return 'li id="menu-item-' + this.model.get('ID') + '"';
    },

    ui: {
      menuItem:       '.menu-item',
      navigationLink: 'a.menu-item:not(.dropdown-toggle)'
    },

    behaviors: {
      MenuItem:   {activeClass: 'active'},
      Navigation: {}
    },

    initialize: function () {
      this.dropdown = false;
    },

    serializeData: function () {
      return _.extend(this.model.toJSON(), { dropdown: this.dropdown });
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
