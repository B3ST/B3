/* global define */

define([
  'backbone',
  'behaviors/pagination-behavior',
  'templates/pagination-template'
], function (Backbone) {
  'use strict';

  var PaginationView = Backbone.Marionette.ItemView.extend({
    template: 'pagination-template.dust',

    tagName: 'div id="paginated"',

    ui: {
      pageNumber:   '.number > a',
      previousPage: '.previous > a',
      nextPage:     '.next > a'
    },

    behaviors: {
      Pagination: { activeClass: 'active', disabledClass: 'disabled' }
    },

    initialize: function (options) {
      options              = options || {};
      this.pages           = options.pages || 1;
      this.page            = options.page || 1;
      this.hasNumberPicker = options.include;
    },

    serializeData: function () {
      return {
        page:               this.page,
        pages:              this.pages,
        isPreviousDisabled: this.page === 1,
        isNextDisabled:     this.page === this.pages,
        hasNumberPicker:    this.hasNumberPicker
      };
    },

    /**
     * Updates the view on a page number change.
     * @param  {Number} page Page number.
     *
     * @todo Maybe turn this into an event handler?
     */
    update: function (page) {
      this.page = page;

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
