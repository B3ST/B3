/* global define */

define([
  'controllers/base-controller',
  'views/menu-view',
  'models/menu-model',
  'buses/navigator'
], function (BaseController, MenuView, Menu, Navigator) {
  'use strict';

  var MenuController = BaseController.extend({
    busEvents: {
      'menu-item:view:navigate': 'navigateToLink'
    },

    showMenu: function (options) {
      this.model = new Menu(options.menus.primary);
      this.show(this._getView(this.model), this._getLoadingOptions(options));
    },

    navigateToLink: function (options) {
      Navigator.navigate(options.link, true);
    },

    _getLoadingOptions: function (options) {
      return {
        region: options.region,
        loading: {
          style: 'none'
        }
      };
    },

    _getView: function (model) {
      return new MenuView({ model: model });
    }
  });

  return MenuController;
});