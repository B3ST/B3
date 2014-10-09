/* global define */

define([
  'jquery',
  'backbone',
  'marionette',
  'dust',
  'dust.marionette',
  'models/menu-item-model',
  'views/menu-item-view'
], function ($, Backbone, Marionette, dust, dustMarionette, MenuItem, MenuItemView) {
  'use strict';

  var MenuView = Backbone.Marionette.CollectionView.extend({
    childView: MenuItemView,
    tagName:   function() {
      return 'ul class="nav navbar-nav"';
    },

    modelEvents: {
      'change': 'getItems'
    },

    initialize: function (options) {
      this.id = options.menuId || 'menu-primary';
    },

    getItems: function () {
      this.collection = this.model.getItems();
      this.render();
    },

    onRender: function () {
      this.$el.attr('id', this.id);
    },

    attachHtml: function (collectionView, itemView) {
      var parentMenu = itemView.model.get('parent');
      if (parentMenu > 0) {
        var placeholder  = '#menu-item-' + parentMenu + ' > ul.dropdown-menu',
            dropdownView = collectionView.children.findByModel(this.collection.get(parentMenu));

        dropdownView.toggleDropdown();
        collectionView.$(placeholder).append(itemView.el);
      } else {
        collectionView.$el.append(itemView.el);
      }
    }
  });

  return MenuView;
});
