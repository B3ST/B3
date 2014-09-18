/* global define */

define([
  'controllers/base-controller',
  'views/pagination-view',
  'buses/event-bus'
], function (BaseController, PaginationView, EventBus) {
  'use strict';

  var PaginationController = BaseController.extend({
    busEvents: {
      'pagination:view:display:next:page':     'nextPage',
      'pagination:view:display:previous:page': 'previousPage',
      'pagination:view:display:page':          'selectPage'
    },

    showPagination: function (options) {
      this.show(new PaginationView(options), { region: options.region });
    },

    nextPage: function (options) {
      EventBus.trigger('pagination:next:page', options);
    },

    previousPage: function (options) {
      EventBus.trigger('pagination:previous:page', options);
    },

    selectPage: function (options) {
      EventBus.trigger('pagination:select:page', options);
    }
  });

  return PaginationController;
});