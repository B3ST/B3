/* global define */

define([
  'underscore',
  'backbone',
  'marionette',
  'models/menu-item-model',
  'models/settings-model',
  'buses/event-bus',
  'behaviors/menu-item-activation-behavior',
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
      menuItem: '.menu-item'
    },

    behaviors: {
      MenuItemActivation: { activeClass: 'active' }
    },

    initialize: function () {
      this.dropdown = false;

      EventBus.on('view:menu:activation', this.onItemActivation, this);
      EventBus.on('header:view:index', this.onItemActivation, this);
    },

    onDestroy: function () {
      EventBus.off('view:menu:activation', this.onItemActivation, this);
      EventBus.off('header:view:index', this.onItemActivation, this);
    },

    serializeData: function () {
      return _.extend(this.model.toJSON(), { dropdown: this.dropdown });
    },

    /**
     * TODO: Move this to a behavior?
     */
    onItemActivation: function (activeItem) {
      var id = this.model.get('ID'),
        parent = this.model.get('parent');

      if (id === activeItem.parent || id === activeItem.id) {
        this.savedActiveItemId = activeItem.id;
      }

      if (activeItem.parent === id) {
        // Propagate up the menu hierarchy
        EventBus.trigger('view:menu:activation', {id: activeItem.id, parent: parent});
      }

      this.$el.toggleClass('active', this.savedActiveItemId === activeItem.id);
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
