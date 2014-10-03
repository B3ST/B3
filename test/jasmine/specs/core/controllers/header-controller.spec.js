/* global define */

define([
  "controllers/header-controller",
  "controllers/base-controller",
  "controllers/search-controller",
  "controllers/menu-controller",
  "views/header-view",
  "buses/navigator"
], function (HeaderController, BaseController, SearchController, MenuController, HeaderView, Navigator) {
  "use strict";

  describe("HeaderController", function() {
    var controller, options;

    beforeEach(function() {
      var region = jasmine.createSpyObj("region", ["show"]);
      options = { region: region, menus: { primary: "" } };
    });

    it("should extend from BaseController", function() {
      expect(inherits(HeaderController, BaseController)).toBeTruthy();
    });

    it("should bind to a given set of events", function() {
      controller = new HeaderController(options);
      expect(controller.busEvents).toEqual({
        "header:view:index": "navigateHome"
      });
    });

    it("should have a given set of childControllers", function() {
      controller = new HeaderController(options);
      expect(controller.childControllers).toEqual({
        "search": "searchController",
        "menu":   "menuController"
      });
    });

    describe(".showHeader", function() {
      var search, show, menu;
      beforeEach(function() {
        controller = new HeaderController(options);
        controller.mainView = jasmine.createSpyObj("view", ["search", "menu"]);

        search = spyOn(SearchController.prototype, "showSearch");
        show = spyOn(controller, "show");
        menu = spyOn(MenuController.prototype, "showMenu");

        controller.showHeader();
      });

      it("should show a HeaderView", function() {
        expect(show).toHaveBeenCalledWith(jasmine.any(HeaderView));
      });

      it("should display a search box", function() {
        expect(search).toHaveBeenCalledWith({ region: controller.mainView.search });
      });

      it("should display the menu", function() {
        expect(menu).toHaveBeenCalledWith({ region: controller.mainView.menu, menus: options.menus });
      });
    });

    describe(".navigateHome", function() {
      it("should navigate to home", function() {
        var navigate = spyOn(Navigator, "navigateToHome");

        controller = new HeaderController(options);
        controller.navigateHome();

        expect(navigate).toHaveBeenCalledWith("", null, true);
      });
    });
  });
});