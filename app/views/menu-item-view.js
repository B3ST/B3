/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'dust',
  'dust.marionette',
  'models/menu-item-model',
  'models/settings-model',
  'controllers/bus/event-bus',
  'controllers/navigation/navigator',
  'navigation/menus/menu-item-template'
], function ($, _, Backbone, Marionette, dust, dustMarionette, MenuItem, Settings, EventBus, Navigator) {
  'use strict';

  var ItemView = Backbone.Marionette.ItemView.extend({
    template: "navigation/menus/menu-item-template.dust",
    model:    MenuItem,
    tagName:  function () {
      return 'li id="menu-item-' + this.model.get('ID') + '"';
    },

    events: {
      'click .b3-menu-item': 'selectMenu'
    },

    initialize: function () {
      this.dropdown = false;

      _.bindAll(this, 'itemSelected');
      EventBus.bind('menu-item:select', this.itemSelected);
    },

    onDestroy: function () {
      EventBus.unbind('menu-item:select', this.itemSelected);
    },

    serializeData: function () {
      return _.extend(this.model.attributes, {dropdown: this.dropdown});
    },

    /**
     * Handle menu selection (click) events.
     *
     * @param {Event} ev Click event.
     */
    selectMenu: function (ev) {
      var link     = ev.currentTarget.href;
      var baseUrl  = Settings.get('url');
      var resource = link.replace(baseUrl, '');

      // Do not handle external links:
      if (link.indexOf(baseUrl) !== 0) {
        return;
      }

      ev.preventDefault();

      if (!this.dropdown) {
        Navigator.navigate(resource, true);
        this.activateMenu();
        this.triggerMenuSelected(this.model.get('ID'), this.model.get('parent'));
      }
    },

    itemSelected: function (item) {
      if (item.parent === this.model.get('ID')) {
        this.itemId = item.id;
        this.activateMenu();
        this.triggerMenuSelected(item.id, this.model.get('parent'));
      } else {
        this.deactivateMenu(item.id);
      }
    },

    activateMenu: function () {
      this.$el.addClass('active');
    },

    deactivateMenu: function (id) {
      if (this.itemId !== id && this.model.get('ID') !== id) {
        this.$el.removeClass('active');
      }
    },

    triggerMenuSelected: function (id, parent) {
      EventBus.trigger('menu-item:select', {id: id, parent: parent});
    },

    toggleDropdown: function () {
      if (!this.dropdown) {
        this.dropdown = true;
        this.render();
        this.$el.toggleClass('dropdown');
      }
    }
  });

  return ItemView;
});
