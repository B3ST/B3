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

    it("should bind to a given set of events", function() {
      controller = new PaginationController();
      expect(controller.busEvents).toEqual({
        'pagination:view:display:next:page':     'nextPage',
        'pagination:view:display:previous:page': 'previousPage',
        'pagination:view:display:page':          'selectPage'
      });
    });

    describe(".showPagination", function() {
      it("should display a PaginationView", function() {
        var show = spyOn(PaginationController.prototype, 'show');

        controller = new PaginationController(options);
        controller.showPagination({ region: region });

        expect(show).toHaveBeenCalledWith(jasmine.any(PaginationView), { region: region });
      });
    });

    sharedBehaviourFor('nextPage', {
      event: 'pagination:next:page',
      runTest: function (controller) {
        controller.nextPage({ page: 1 });
      }
    });

    sharedBehaviourFor('previousPage', {
      event: 'pagination:previous:page',
      runTest: function (controller) {
        controller.previousPage({ page: 1 });
      }
    });

    sharedBehaviourFor('previousPage', {
      event: 'pagination:select:page',
      runTest: function (controller) {
        controller.selectPage({ page: 1 });
      }
    });
  });

  function sharedBehaviourFor (method, options) {
    describe(method, function() {
      it("should trigger a " + options.event + " event", function() {
        var bus = spyOn(EventBus, 'trigger'),
            controller = new PaginationController(options);

        options.runTest(controller);
        expect(bus).toHaveBeenCalledWith(options.event, { page: 1 });
      });
    });
  }
});