/* global define */

define([
  'backbone',
  'buses/event-bus',
  'templates/pagination-template'
], function (Backbone, EventBus) {
  'use strict';

  var PaginationView = Backbone.Marionette.ItemView.extend({
    template: 'pagination-template.dust',
    events: {
      'click .next:not(.disabled) > a':       'onNextClicked',
      'click .previous:not(.disabled) > a':   'onPrevClicked',
      'click .number:not(.active) > a':       'onPageClicked',
    },

    initialize: function (options) {
      options      = options || {};
      this.pages   = options.pages || 1;
      this.page    = options.page || 1;
      this.include = options.include;
    },

    serializeData: function () {
      return {
        pages:         this.pages,
        page:          this.page,
        next_disabled: this.page === this.pages,
        prev_disabled: this.page === 1,
        include_pages: this.include
      };
    },

    onNextClicked: function (ev) {
      this.page++;
      this._checkPaginationControls();
      EventBus.trigger('pagination:view:display:next:page', { page: this.page });
      ev.preventDefault();
    },

    onPrevClicked: function (ev) {
      this.page--;
      this._checkPaginationControls();
      EventBus.trigger('pagination:view:display:previous:page', { page: this.page });
      ev.preventDefault();
    },

    onPageClicked: function (ev) {
      var data = $(ev.currentTarget).attr('data-page');
      this.page = parseInt(data, 10);
      this._checkPaginationControls();
      EventBus.trigger('pagination:view:display:page', { page: this.page });
      ev.preventDefault();
    },

    _checkPaginationControls: function () {
      this.$('.disabled').removeClass('disabled');
      this.$('.active').removeClass('active');

      if (this.page === 1) {
        this.$('.previous').addClass('disabled');
      }

      if (this.page === this.pages) {
        this.$('.next').addClass('disabled');
      }

      this.$('li[data-page="' + this.page + '"]').addClass('active');
    }
  });

  return PaginationView;
});