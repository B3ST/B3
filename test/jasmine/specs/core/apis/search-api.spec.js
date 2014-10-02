/* global define */

define([
  "apis/search-api",
  "buses/command-bus"
], function (SearchAPI, CommandBus) {
  "use strict";

  describe("SearchAPI", function() {
    var api;

    describe(".showSearch", function() {
      it("should call searchTerm of SearchController", function() {
        var bus   = spyOn(CommandBus, "execute"),
            search = { search: "search", paged: 1 };

        api = new SearchAPI();
        api.showSearch(search);

        expect(bus).toHaveBeenCalledWith("search:term", search);
      });
    });
  });
});