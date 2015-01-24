/* global define */

define([
  'controllers/base-controller',
  'views/sidebar-view',
  'models/sidebar-model',
  'buses/navigator'
], function (BaseController, SidebarView, Sidebar, Navigator) {
  'use strict';

  var SidebarController = BaseController.extend({
    busEvents: {
      'sidebar:view:link': 'navigate'
    },

    initialize: function (options) {
      options       = options || {};
      this.model    = options.model || new Sidebar(options.sidebar);
      this.template = options.template;
    },

    showSidebar: function () {
      this.show(this._getView(this.model, this.template), { loading: { style: 'none' } });
    },

    navigate: function (options) {
      Navigator.navigate(options.link, true);
    },

    _getView: function (model, template) {
      return new SidebarView({ model: model, template: template });
    }
  });

  return SidebarController;
});