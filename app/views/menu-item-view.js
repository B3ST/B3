/* global define */

define([
  'underscore',
  'backbone',
  'marionette',
  'models/menu-item-model',
  'models/settings-model',
  'buses/event-bus',
  'templates/navigation/menus/menu-item-template'
], function (_, Backbone, Marionette, MenuItem, Settings, EventBus) {
  'use strict';

  var MenuItemView = Backbone.Marionette.ItemView.extend({
    template: 'navigation/menus/menu-item-template.dust',
    model:    MenuItem,
    tagName:  function () {
      return 'li id="menu-item-' + this.model.get('ID') + '"';
    },

    events: {
      'click .menu-item': 'selectMenu'
    },

    initialize: function () {
      this.dropdown = false;
      EventBus.on('menu-item:view:select', this.itemSelected, this);
      EventBus.on('header:view:index', this.itemSelected, this);
    },

    onDestroy: function () {
      EventBus.off('menu-item:view:select', this.itemSelected, this);
      EventBus.off('header:view:index', this.itemSelected, this);
    },

    serializeData: function () {
      return _.extend(this.model.toJSON(), { dropdown: this.dropdown });
    },

    /**
     * Handle menu selection (click) events.
     *
     * @param {Event} ev Click event.
     */
    selectMenu: function (ev) {
      var link    = ev.currentTarget.href,
          baseUrl = Settings.get('site_url');

      // Do not handle external links:
      if (link.indexOf(baseUrl) !== 0) {
        return;
      }

      ev.preventDefault();

      if (!this.dropdown) {
        EventBus.trigger('menu-item:view:navigate', { link: link });
        this._activateMenu();
        this._triggerMenuSelected(this.model.get('ID'), this.model.get('parent'));
      }
    },

    itemSelected: function (item) {
      if (item.parent === this.model.get('ID')) {
        this.itemId = item.id;
        this._activateMenu();
        this._triggerMenuSelected(item.id, this.model.get('parent'));
      } else {
        this._deactivateMenu(item.id);
      }
    },

    _activateMenu: function () {
      this.$el.addClass('active');
    },

    _deactivateMenu: function (id) {
      if (this.itemId !== id && this.model.get('ID') !== id) {
        this.$el.removeClass('active');
      }
    },

    _triggerMenuSelected: function (id, parent) {
      EventBus.trigger('menu-item:view:select', {id: id, parent: parent});
    },

    toggleDropdown: function () {
      if (!this.dropdown) {
        this.dropdown = true;
        this.render();
        this.$el.toggleClass('dropdown');
      }
    }
  });

  return MenuItemView;
});
