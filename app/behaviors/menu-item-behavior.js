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

    initialize: function () {
      EventBus.on('change:menu:item:state', this.onMenuItemUpdate, this);
    },

    onDestroy: function () {
      EventBus.off('change:menu:item:state', this.onMenuItemUpdate, this);
    },

    /**
     * Menu item update handler.
     * @param {Object} activeItem Data about the currently active item.
     *
     * @todo Consider also taking object, object_parent and object_type
     * to update menu item state on deep link navigation.
     */
    onMenuItemUpdate: function (activeItem) {
      var id = this.view.model.get('ID'),
        parent = this.view.model.get('parent');

      if (this._isMenuItemObject(activeItem)) {
        activeItem.id = id;
        this._propagateMenuItemState(activeItem, parent);
        return;
      }

      if (id === activeItem.parent || id === activeItem.id) {
        this.view.activeChildId = activeItem.id;
      }

      if (activeItem.parent === id) {
        this._propagateMenuItemState(activeItem, parent);
      }

      this.$el.toggleClass(this.options.activeClass, this._isActiveChild(activeItem));
    },

    /**
     * Menu item activation handler.
     * @param {Event} event Click event.
     */
    onMenuItemActivation: function () {
      if (!this.view.dropdown) {
        var activeItem = {
          id:     this.view.model.get('ID')     || 0,
          parent: this.view.model.get('parent') || 0
        };

        this.$el.addClass(this.options.activeClass);

        EventBus.trigger('change:menu:item:state', activeItem);
      }
    },

    _isMenuItemObject: function (activeItem) {
      var object   = this.view.model.get('object'),
        objectType = this.view.model.get('object_type');

      return !activeItem.id && activeItem.object && objectType === activeItem.objectType && object === activeItem.object;
    },

    _isActiveChild: function (activeItem) {
      return !!activeItem.id && this.view.activeChildId === activeItem.id;
    },

    _propagateMenuItemState: function (activeItem, parent) {
        activeItem.parent = parent;
        EventBus.trigger('change:menu:item:state', activeItem);
    }

  });

  /**
   * Register behavior.
   * @type {MenuItem}
   */
  window.Behaviors.MenuItem = MenuItem;

  return MenuItem;
});
