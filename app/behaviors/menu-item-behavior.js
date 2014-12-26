/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus'
], function (Backbone, Marionette, EventBus) {
  'use strict';

  var MenuItem = Marionette.Behavior.extend({

    defaults: {
      activeClass: 'active'
    },

    events: {
      'click @ui.menuItem': 'onMenuItemActivation'
    },

    /**
     * Menu item update handler.
     * @param {Object} activeItem Data about the currently active item.
     *
     * @todo Consider also taking object, object_parent and object_type
     * to update menu item state on deep link navigation.
     */
    onMenuItemUpdate: function (activeItem) {
      var id = this.view.model.get('ID');

      if (id === activeItem.parent || id === activeItem.id) {
        this.view.activeChildId = activeItem.id;
      }

      if (activeItem.parent === id) {
        // Propagate up the menu hierarchy
        activeItem.parent = this.view.model.get('parent');
        EventBus.trigger('view:menu:state:change', activeItem);
      }

      this.$el.toggleClass(this.options.activeClass, this.view.activeChildId === activeItem.id);
    },

    /**
     * Menu item activation handler.
     * @param {Event} event Click event.
     */
    onMenuItemActivation: function (event) {
      if (!this.view.dropdown) {
        var activeItem = {
          id:     this.view.model.get('ID')     || 0,
          parent: this.view.model.get('parent') || 0
        };

        this.$el.addClass(this.options.activeClass);

        EventBus.trigger('view:menu:state:change', activeItem);
      }
    }
  });

  /**
   * Register behavior.
   * @type {MenuItem}
   */
  window.Behaviors.MenuItem = MenuItem;

  return MenuItem;
});
