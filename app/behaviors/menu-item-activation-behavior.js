/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus',
  'models/settings-model'
], function (Backbone, Marionette, EventBus, Settings) {
  'use strict';

  var MenuItemActivation = Marionette.Behavior.extend({

    defaults: {
      navigationEvent: 'menu-item:view:navigate',
      activationEvent: 'view:menu:activation',
      activeClass:     'active'
    },

    events: {
      'click @ui.menuItem': 'onMenuItemActivation'
    },

    /**
     * Menu item update handler.
     * @param {Object} activeItem Data about the currently active item.
     */
    onMenuItemUpdate: function (activeItem) {
      var id = this.view.model.get('ID');

      if (id === activeItem.parent || id === activeItem.id) {
        this.view.activeChildId = activeItem.id;
      }

      if (activeItem.parent === id) {
        // Propagate up the menu hierarchy
        var parent = this.view.model.get('parent'),
          updatedActiveItem = {id: activeItem.id, parent: parent};

        EventBus.trigger(this.options.activationEvent, updatedActiveItem);
      }

      this.$el.toggleClass(this.options.activeClass, this.view.activeChildId === activeItem.id);
    },

    /**
     * Menu item activation handler.
     * @param {Event} event Click event.
     */
    onMenuItemActivation: function (event) {
      var link = event.currentTarget.href,
        baseUrl = Settings.get('site_url');

      // Do not handle external links:
      if (link.indexOf(baseUrl) !== 0) {
        return;
      }

      if (!this.view.dropdown) {
        var activeItem = {id: this.view.model.get('ID'), parent: this.view.model.get('parent')};

        this.$el.addClass(this.options.activeClass);

        EventBus.trigger(this.options.activationEvent, activeItem);
        EventBus.trigger(this.options.navigationEvent, {link: link});
      }

      event.preventDefault();
    }
  });

  /**
   * Register behavior.
   * @type {MenuItemActivation}
   */
  window.Behaviors.MenuItemActivation = MenuItemActivation;

  return MenuItemActivation;
});
