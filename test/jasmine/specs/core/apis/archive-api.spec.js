/* global define */

define([
  'apis/archive-api',
  'controllers/archive-controller',
  'models/settings-model',
  'buses/event-bus'
], function (ArchiveAPI, ArchiveController, Settings, EventBus) {
  'use strict';

  describe("ArchiveAPI", function() {
    var api;

    describe(".showHome", function() {
      describe("When home is not a page", function() {
        it("should display the archive", function() {
          spyOn(Settings, 'get').and.callFake(function () {
            return 0;
          });
          var archive = spyOn(ArchiveAPI.prototype, 'showArchive');

          api = new ArchiveAPI();
          api.showHome();

          expect(archive).toHaveBeenCalled();
        });
      });

      describe("When home is set to a page", function() {
        it("should display that page", function() {
          spyOn(Settings, 'get').and.callFake(function () {
            return 100;
          });
          var bus = spyOn(EventBus, 'trigger');

          api = new ArchiveAPI();
          api.showHome();

          expect(bus).toHaveBeenCalledWith('page:show', {page: 100});
        });
      });
    });

    sharedArchiveAPIBehaviourFor(".showArchive", {
      runTest: function (api) {
        api.showArchive({});
      }
    });

    sharedArchiveAPIBehaviourFor(".showPostByCategory", {
      runTest: function (api) {
        api.showPostByCategory({ category: 'category' });
      }
    });

    sharedArchiveAPIBehaviourFor(".showPostByAuthor", {
      runTest: function (api) {
        api.showPostByAuthor({ author: 'author' });
      }
    });

    sharedArchiveAPIBehaviourFor(".showPostByData", {
      runTest: function (api) {
        api.showPostByDate({ year: '2013', monthnum: '05', day: '21' });
      }
    })
  });

  function sharedArchiveAPIBehaviourFor (method, options) {
    describe(".showArchive", function() {
      it("should call showArchive from ArchiveController", function() {
        var show = spyOn(ArchiveController.prototype, 'showArchive'),
            api  = new ArchiveAPI();

        options.runTest(api);
        expect(show).toHaveBeenCalled();
      });
    });
  }
});