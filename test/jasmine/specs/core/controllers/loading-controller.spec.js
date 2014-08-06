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
        this.bus = spyOn(CommandBus, 'setHandler');
        this.view = new LoadingController({});
      });

      it("should bind to loading:show command", function() {
        expect(this.bus).toHaveBeenCalledWith('loading:show', this.view.displayLoading);
      });

      it("should bind to loading:hide command", function() {
        expect(this.bus).toHaveBeenCalledWith('loading:hide', this.view.removeLoading);
      });

      it("should bind to loading:progress command", function() {
        expect(this.bus).toHaveBeenCalledWith('loading:progress', this.view.displayProgress);
      });
    });

    describe(".displayLoading", function() {
      it("should display a loading view", function() {
        this.show = spyOn(App.main, 'show');
        this.view = new LoadingController({region: App.main});
        this.view.displayLoading();

        var view = this.show.mostRecentCall.args[0];
        expect(view instanceof LoadingView).toBeTruthy();
      });
    });

    describe(".removeLoading", function() {
      it("should remove the loading view", function() {
        this.destroy = spyOn(LoadingView.prototype, 'destroy');
        this.view    = new LoadingController({region: App.main});
        this.view.displayLoading();

        this.view.removeLoading();
        expect(this.destroy).toHaveBeenCalled();
      });
    });

    describe(".displayProgress", function() {
      it("should display the current progress", function() {
        this.progress = spyOn(LoadingView.prototype, 'progress');
        this.view = new LoadingController({region: App.main});
        this.view.displayLoading();

        this.view.displayProgress({loaded: 10});
        expect(this.progress).toHaveBeenCalledWith({loaded: 10});
      });
    });
  });
});
