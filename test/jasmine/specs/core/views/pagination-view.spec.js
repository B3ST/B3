/* global define */

define([
  'views/pagination-view',
  'buses/event-bus'
], function (PaginationView, EventBus) {
  'use strict';

  describe('PaginationView', function() {
    var view, bus;

    describe('When clicking in next button', function() {
      beforeEach(function() {
        bus  = spyOn(EventBus, 'trigger');
        view = new PaginationView({ pages: 2, page: 1 });
        view.render();
        view.$('.next > a').click();
      });

      it('should trigger a pagination:next:page event', function() {
        expect(bus).toHaveBeenCalledWith('pagination:next:page', { page: 2 });
      });

      it('should increment the page', function() {
        expect(view.page).toEqual(2);
      });

      it('should disable the next button if it is the last page', function() {
        expect(view.$('.next').hasClass('disabled')).toBeTruthy();
      });
    });

    describe('When clicking in previous button', function() {
      beforeEach(function() {
        bus  = spyOn(EventBus, 'trigger');
        view = new PaginationView({ pages: 2, page: 2 });
        view.render();
        view.$('.previous > a').click();
      });

      it('should trigger a pagination:previous:page event', function() {
        expect(bus).toHaveBeenCalledWith('pagination:previous:page', { page: 1 });
      });

      it('should increment the page', function() {
        expect(view.page).toEqual(1);
      });

      it('should disable the previous button if it is the last page', function() {
        expect(view.$('.previous').hasClass('disabled')).toBeTruthy();
      });
    });

    describe('When clicking in a page button', function() {
      beforeEach(function() {
        bus  = spyOn(EventBus, 'trigger');
        view = new PaginationView({ include: true, pages: 2, page: 2 });
        view.render();
        view.$('.pagination .number:eq(0) > a').click();
      });

      it('should trigger a pagination:select:page event', function() {
        expect(bus).toHaveBeenCalledWith('pagination:select:page', { page: 1 });
      });

      it('should increment the page', function() {
        expect(view.page).toEqual(1);
      });

      it('should set the clicked page active', function() {
        expect(view.$('.pagination .number:eq(0) > a').parent().hasClass('active')).toBeTruthy();
      });
    });
  });
});