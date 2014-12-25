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
      event:       'menu-item:view:navigate',
      activeClass: 'active'
    },

    events: {
      'click @ui.menuItem': 'onMenuItemActivation'
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
        this.view.$el.addClass('active');
        EventBus.trigger(this.options.event, {link: link});

        // Highlight selection up the menu hierarchy:
        EventBus.trigger('view:menu:activation', {id: this.view.model.get('ID'), parent: this.view.model.get('parent')});
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
