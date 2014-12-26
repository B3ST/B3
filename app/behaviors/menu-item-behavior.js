/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus',
  'models/settings-model'
], function (Backbone, Marionette, EventBus, Settings) {
  'use strict';

  var MenuItem = Marionette.Behavior.extend({

    defaults: {
      navigationEvent: 'menu-item:view:navigate',
      activationEvent: 'view:menu:activation',
      activeClass:     'active'
    },

    events: {
      'click @ui.menuItem': 'onActivation'
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
        EventBus.trigger(this.options.activationEvent, activeItem);
      }

      this.$el.toggleClass(this.options.activeClass, this.view.activeChildId === activeItem.id);
    },

    /**
     * Menu item activation handler.
     * @param {Event} event Click event.
     */
    onActivation: function (event) {
      var baseUrl = Settings.get('site_url'),
        link = event.currentTarget.href;

      if (link.indexOf(baseUrl) !== 0) {
        // Do not handle external links:
        return;
      }

      if (!this.view.dropdown) {
        var activeItem = {
          id:     this.view.model.get('ID')     || 0,
          parent: this.view.model.get('parent') || 0
        };

        this.$el.addClass(this.options.activeClass);

        EventBus.trigger(this.options.activationEvent, activeItem);

        // FIXME: Use navigation behaviors instead of this
        EventBus.trigger(this.options.navigationEvent, {link: link});
      }

      event.preventDefault();
    }
  });

  /**
   * Register behavior.
   * @type {MenuItem}
   */
  window.Behaviors.MenuItem = MenuItem;

  return MenuItem;
});
