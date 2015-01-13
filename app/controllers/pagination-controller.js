/* global define */

define([
  'controllers/base-controller',
  'views/pagination-view'
], function (BaseController, PaginationView) {
  'use strict';

  var PaginationController = BaseController.extend({
    showPagination: function (options) {
      this.show(new PaginationView(options), { region: options.region });
    }
  });

  return PaginationController;
});