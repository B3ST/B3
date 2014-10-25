/* global define */

define([
  'apis/archive-api',
  'controllers/archive-controller',
  'collections/taxonomy-collection',
  'models/taxonomy-model',
  'models/settings-model',
  'buses/event-bus'
], function (ArchiveAPI, ArchiveController, Taxonomies, Taxonomy, Settings, EventBus) {
  'use strict';

  describe("ArchiveAPI", function() {
    var api;

    describe("When initializing", function() {
      it("should bind to a given set of events", function() {
        var bus = spyOn(EventBus, "on");

        api = new ArchiveAPI();
        expect(bus).toHaveBeenCalledWith("archive:show", api.showArchive, api);
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
    });

    sharedArchiveAPIBehaviourFor(".showPostByTaxonomy", {
      runTest: function (api) {
        api.showPostByTaxonomy({ "jetpack-portfolio-tag": "tagged", "paged": null });
      }
    });
  });

  function sharedArchiveAPIBehaviourFor (method, options) {
    describe(".showArchive", function() {
      it("should call showArchive from ArchiveController", function() {
        var show     = spyOn(ArchiveController.prototype, 'showArchive'),
            taxonomy = new Taxonomy({ slug: 'jetpack-portfolio-tag', types: { 'jetpack-portfolio': {} } }),
            api      = new ArchiveAPI({ taxonomies: new Taxonomies([taxonomy]) });

        options.runTest(api);
        expect(show).toHaveBeenCalled();
      });
    });
  }
});