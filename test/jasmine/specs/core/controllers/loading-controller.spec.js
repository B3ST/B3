/* global define */

define([
  'controllers/base-controller',
  'controllers/loading-controller',
  'buses/command-bus',
  'views/loading-view',
  'app'
], function (BaseController, LoadingController, CommandBus, LoadingView, App) {
  'use strict';

  describe("LoadingController", function() {
    var controller, options;

    beforeEach(function() {
      var region   = jasmine.createSpyObj('region', ['show']),
          view     = jasmine.createSpy('view');

      options = { options: { region: region, title: '' }, view: view, config: {} };
    });

    it("should extend from BaseController", function() {
      expect(inherits(LoadingController, BaseController)).toBeTruthy();
    });

    describe("When initializing", function() {
      var bus, show;

      it("should bind to loading:progress", function() {
        bus = spyOn(CommandBus, 'setHandler');

        controller = new LoadingController(options);
        expect(bus).toHaveBeenCalledWith('loading:progress', controller.displayProgress, controller);
      });

      it("should display a LoadingView", function() {
        show = spyOn(LoadingController.prototype, 'show');

        controller = new LoadingController(options);
        expect(show).toHaveBeenCalledWith(jasmine.any(LoadingView), options.options);
      });

      describe("When specifying done and fail callbacks", function() {
        it("should use those callbacks", function() {
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
    });

    describe(".displayProgress", function() {
      it("should display the current progress", function() {
        this.progress   = spyOn(LoadingView.prototype, 'progress');
        this.controller = new LoadingController(options);

        this.controller.displayProgress({loaded: 10});
        expect(this.progress).toHaveBeenCalledWith({loaded: 10});
      });
    });
  });
});
