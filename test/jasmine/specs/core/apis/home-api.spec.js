/* global define */

define([
  "apis/home-api",
  "models/settings-model",
  "buses/event-bus"
], function (HomeAPI, Settings, EventBus) {
  "use strict";

  describe("HomeAPI", function() {
    describe(".showHome", function() {
      var bus, api;

      beforeEach(function() {
        bus = spyOn(EventBus, 'trigger');
      });

      describe("When home is not a page", function() {
        it("should display the archive", function() {
          spyOn(Settings, 'get').and.callFake(function () {
            return 0;
          });

          api = new HomeAPI();
          api.showHome();

          expect(bus).toHaveBeenCalledWith('archive:show', {});
        });
      });

      describe("When home is set to a page", function() {
        it("should display that page", function() {
          spyOn(Settings, 'get').and.callFake(function () {
            return 100;
          });

          api = new HomeAPI();
          api.showHome();

          expect(bus).toHaveBeenCalledWith('single:show', { id: 100 });
        });
      });
    });
  });
});