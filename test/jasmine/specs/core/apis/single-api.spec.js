/* global define */

define([
  "apis/single-api",
  "controllers/single-controller",
  "buses/event-bus"
], function (SingleAPI, SingleController, EventBus) {
  "use strict";

  describe("SingleAPI", function() {
    var api;

    describe("When initializing", function() {
      it("should bind to a given set of events", function() {
        var bus = spyOn(EventBus, "on");

        api = new SingleAPI();
        expect(bus).toHaveBeenCalledWith("single:show", api.showPageById, api);
      });
    });

    sharedSingleAPIBehaviourFor(".showPageById", {
      runTest: function (api) {
        api.showPageById({ page: 1 });
      }
    });

    sharedSingleAPIBehaviourFor(".showPostBySlug", {
      runTest: function (api) {
        api.showPostBySlug({ post: "post" });
      }
    });

    sharedSingleAPIBehaviourFor(".showPageBySlug", {
      runTest: function (api) {
        api.showPageBySlug({ page: "page" });
      }
    });

    sharedSingleAPIBehaviourFor(".showPostTypeBySlug", {
      runTest: function (api) {
        api.showPostTypeBySlug({ "jetpack-portfolio": "jetpacked", "paged": null} );
      }
    });
  });

  function sharedSingleAPIBehaviourFor (method, options) {
    describe(method, function() {
      it("should call showSingle of SingleController", function() {
        var showSingle = spyOn(SingleController.prototype, "showSingle"),
            api = new SingleAPI();

        options.runTest(api);
        expect(showSingle).toHaveBeenCalled();
      });
    });
  }
});