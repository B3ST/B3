/* global define */

define([
  'controllers/pagination-controller',
  'controllers/base-controller',
  'views/pagination-view',
  'buses/event-bus'
], function (PaginationController, BaseController, PaginationView, EventBus) {
  'use strict';

  describe("PaginationController", function() {
    var controller, options, region;

    beforeEach(function() {
      region  = jasmine.createSpyObj('region', ['show']);
      options = { region: region };
    });

    it("should extend from BaseController", function() {
      expect(inherits(PaginationController, BaseController)).toBeTruthy();
    });

    describe(".showPagination", function() {
      it("should display a PaginationView", function() {
        var show = spyOn(PaginationController.prototype, 'show');

        controller = new PaginationController(options);
        controller.showPagination({ region: region });

        expect(show).toHaveBeenCalledWith(jasmine.any(PaginationView), { region: region });
      });
    });
  });
});