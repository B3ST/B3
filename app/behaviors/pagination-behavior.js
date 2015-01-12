/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus'
], function (Backbone, Marionette, EventBus) {
  'use strict';

  var Pagination = Marionette.Behavior.extend({
    defaults: {
      disabledClass: 'disabled',
      activeClass:   'active'
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
        var page = $(event.currentTarget).data('page');
        this._updatePage(parseInt(page, 10));
        EventBus.trigger('pagination:view:display:page', { page: this.view.page });
      }
      event.preventDefault();
    },

    /**
     * Previous page activation handler.
     * @param {Event} event Activation event.
     */
    onPreviousPageActivation: function (event) {
      if (!$(event.currentTarget).hasClass(this.options.disabledClass)) {
        this._updatePage(this.view.page - 1);
        EventBus.trigger('pagination:view:display:previous:page', { page: this.view.page });
      }
      event.preventDefault();
    },

    /**
     * Next page activation handler.
     * @param {Event} event Activation event.
     */
    onNextPageActivation: function (event) {
      if (!$(event.currentTarget).hasClass(this.options.disabledClass)) {
        this._updatePage(this.view.page + 1);
        EventBus.trigger('pagination:view:display:next:page', { page: this.view.page });
      }
      event.preventDefault();
    },

    /**
     * Updates the view on a page number change.
     * @param  {Number} page Page number.
     */
    _updatePage: function (page) {
      var active = this.options.activeClass,
        disabled = this.options.disabledClass;

      page = this._sanitizePage(page);

      this.$('li[data-page="' + this.view.page + '"]').removeClass(active);
      this.$('li[data-page="' + page + '"]').addClass(active);

      this.$('.previous').toggleClass(disabled, page === 1);
      this.$('.next').toggleClass(disabled, page === this.view.pages);

      this.view.page = page;
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
