define([
  'jquery',
  'marionette',
  'dust',
  'dust.marionette',
  'models/menu-item-model',
  'views/menu-item-view'
], function ($, Marionette, dust, dustMarionette, MenuItem, MenuItemView) {
  'use strict;'

  var MenuView = Backbone.Marionette.CollectionView.extend({
    childView: MenuItemView,
    tagName:   function() {
      return 'ul id="" class="nav navbar-nav"';
    },

    initialize: function (options) {
      this.menuId = options.menuId || 'menu-primary';
      this.collection.sort();
    },

    onRender: function () {
      this.$el.attr('id', this.menuId);
    },

    attachHtml: function (collectionView, itemView, index) {
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