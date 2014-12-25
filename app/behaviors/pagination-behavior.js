/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus'
], function (Backbone, Marionette, EventBus) {
  'use strict';

  var Pagination = Marionette.Behavior.extend({
    defaults: {
      // page:           1,
      // pages:          1,
      disabledClass:     'disabled',
      activeClass:       'active',
      pageNumberEvent:   'pagination:view:display:page',
      previousPageEvent: 'pagination:view:display:previous:page',
      nextPageEvent:     'pagination:view:display:next:page'
    },

    events: {
      'click @ui.pageNumber':   'onPageActivation',
      'click @ui.previousPage': 'onPreviousPageActivation',
      'click @ui.nextPage':     'onNextPageActivation'
    },

    /**
     * Page number activation handler.
     * @param {Event} event Activation event.
     */
    onPageActivation: function (event) {
      if (!$(event.currentTarget).hasClass(this.options.activeClass)) {
        var pageData = $(event.currentTarget).attr('data-page'),
          page = this._sanitizePage(parseInt(pageData, 10));
        this.view.update(page); // TODO: Why not reuse the event?
        EventBus.trigger(this.options.pageNumberEvent, { page: page });
      }
      event.preventDefault();
    },

    /**
     * Previous page activation handler.
     * @param {Event} event Activation event.
     */
    onPreviousPageActivation: function (event) {
      if (!$(event.currentTarget).hasClass(this.options.disabledClass)) {
        var page = this._sanitizePage(this.view.page - 1);
        this.view.update(page); // TODO: Why not reuse the event?
        EventBus.trigger(this.options.previousPageEvent, { page: page });
      }
      event.preventDefault();
    },

    /**
     * Next page activation handler.
     * @param {Event} event Activation event.
     */
    onNextPageActivation: function (event) {
      if (!$(event.currentTarget).hasClass(this.options.disabledClass)) {
        var page = this._sanitizePage(this.view.page + 1);
        this.view.update(page); // TODO: Why not reuse the event?
        EventBus.trigger(this.options.nextPageEvent, { page: page });
      }
      event.preventDefault();
    },

    /**
     * Page number sanitization.
     * @param  {Number} page Page number.
     * @return {Number}      Valid page number.
     */
    _sanitizePage: function (page) {
      if (page < 1) {
        page = 1;
      }

      if (page > this.view.pages) {
        page = this.view.pages;
      }

      return page;
    },
  });

  /**
   * Register behavior.
   * @type {Pagination}
   */
  window.Behaviors.Pagination = Pagination;

  return Pagination;
});
