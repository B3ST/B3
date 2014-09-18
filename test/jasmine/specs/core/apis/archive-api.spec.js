/* global define */

define([
  'apis/archive-api',
  'controllers/archive-controller'
], function (ArchiveAPI, ArchiveController) {
  'use strict';

  describe("ArchiveAPI", function() {
    var api;

    describe(".showArchive", function() {
      it("should call showArchive from ArchiveController", function() {
        var show = spyOn(ArchiveController.prototype, 'showArchive');

        api = new ArchiveAPI();
        api.showArchive({});

        expect(show).toHaveBeenCalled();
      });
    });
  });
});