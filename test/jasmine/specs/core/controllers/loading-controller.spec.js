/* global define */

define([
  'controllers/base-controller',
  'controllers/loading-controller',
  'buses/command-bus',
  'views/loading-view'
], function (BaseController, LoadingController, CommandBus, LoadingView) {
  'use strict';

  describe('LoadingController', function() {
    var controller, options;

    beforeEach(function() {
      var region = jasmine.createSpyObj('region', ['show']),
          view   = jasmine.createSpy('view');

      options = { options: { region: region, title: '' }, view: view, config: {} };
    });

    it('should extend from BaseController', function() {
      expect(inherits(LoadingController, BaseController)).toBeTruthy();
    });

    it('should bind to a given set of events', function() {
      controller = new LoadingController(options);
      expect(controller.busEvents).toEqual({
        'fetch:done': 'closeLoading',
        'fetch:fail': 'closeLoading',

        'save:done':  'closeLoading',
        'save:fail':  'closeLoading'
      });
    });

    describe('When initializing', function() {
      var bus, show;

      it('should display a LoadingView', function() {
        show = spyOn(LoadingController.prototype, 'show');

        controller = new LoadingController(options);
        expect(show).toHaveBeenCalledWith(jasmine.any(LoadingView), options.options);
      });

      describe('When specifying done and fail callbacks', function() {
        it('should use those callbacks', function() {
          var done = jasmine.createSpy('done'),
              fail = jasmine.createSpy('fail');

          bus  = spyOn(CommandBus, 'execute');
          show = spyOn(LoadingController.prototype, 'show');

          options.config.done = done;
          options.config.fail = fail;
          controller = new LoadingController(options);

          expect(bus).toHaveBeenCalledWith('when:fetched', [], done, fail);
        });
      });

      using('Operations', [
        { operation: 'fetch', command: 'when:fetched' },
        { operation: 'save', command: 'when:saved' }
      ], function (input) {
        describe('When specifying operation ' + input.operation, function() {
          it('should execute ' + input.command + ' command', function() {
            bus = spyOn(CommandBus, 'execute');

            options.config.operation = input.operation;
            controller = new LoadingController(options);

            expect(bus).toHaveBeenCalledWith(input.command, [], jasmine.any(Function), jasmine.any(Function));
          });
        });
      });
    });
  });
});
