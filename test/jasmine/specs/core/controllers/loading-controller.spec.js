/* global define */

define([
  'controllers/loading-controller',
  'controllers/bus/command-bus',
  'views/loading-view',
  'app'
], function (LoadingController, CommandBus, LoadingView, App) {
  'use strict';

  describe("LoadingController", function() {
    describe(".initialize", function() {
      beforeEach(function() {
        this.bus        = spyOn(CommandBus, 'setHandler');
        this.controller = new LoadingController({});
      });

      it("should bind to loading:progress command", function() {
        expect(this.bus).toHaveBeenCalledWith('loading:progress', this.controller.displayProgress);
      });
    });

    describe(".displayLoading", function() {
      beforeEach(function() {
        this.show       = spyOn(App.main, 'show');
        this.destroy      = spyOn(LoadingController.prototype, 'listenTo');
        this.controller = new LoadingController({region: App.main});
        this.controller.displayLoading();
      });

      it("should display a loading view", function() {
        var view = this.show.calls.mostRecent();
        expect(view typeof LoadingView).toBeTruthy();
      });

      it("should bind to its destroy event", function() {
        expect(this.destroy).toHaveBeenCalledWith(jasmine.any(LoadingView), 'destroy', this.controller.destroy);
      });
    });

    describe(".displayProgress", function() {
      it("should display the current progress", function() {
        this.progress   = spyOn(LoadingView.prototype, 'progress');
        this.controller = new LoadingController({region: App.main});
        this.controller.displayLoading();

        this.controller.displayProgress({loaded: 10});
        expect(this.progress).toHaveBeenCalledWith({loaded: 10});
      });
    });
  });
});
