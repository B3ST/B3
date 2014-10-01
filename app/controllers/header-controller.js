/* global define */

define([
  'controllers/base-controller',
  'controllers/search-controller',
  'controllers/menu-controller',
  'views/header-view'
], function (BaseController, SearchController, MenuController, HeaderView) {
  'use strict';

  var HeaderController = BaseController.extend({
    childControllers: {
      'search': 'searchController',
      'menu':   'menuController'
    },

    initialize: function (options) {
      this.options = options;
    },

    showHeader: function () {
      this.show(this._getView(this.model));
      this.search.showSearch({ region: this.mainView.search });
      this.menu.showMenu({ region: this.mainView.menu, menus: this.options.menus });
    },

    searchController: function () {
      return new SearchController();
    },

    menuController: function () {
      return new MenuController();
    },

    _getView: function () {
      return new HeaderView();
    }
  });

  return HeaderController;
});