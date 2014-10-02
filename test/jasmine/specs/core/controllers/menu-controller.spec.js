/* global define */

define([
  "controllers/menu-controller",
  "controllers/base-controller",
  "views/menu-view",
  "buses/navigator"
], function (MenuController, BaseController, MenuView, Navigator) {
  "use strict";

  describe("MenuController", function() {
    var controller, options;

    beforeEach(function() {
      var region = jasmine.createSpyObj('region', ['show']);
      options = { region: region, menus: { primary: '' } };
    });

    it("should extend from BaseController", function() {
      expect(inherits(MenuController, BaseController)).toBeTruthy();
    });

    it("should bind to a given set of events", function() {
      controller = new MenuController();
      expect(controller.busEvents).toEqual({
        'menu-item:view:navigate': 'navigateToLink'
      });
    });

    describe(".showMenu", function() {
      it("should load the menu items", function() {
        var show = spyOn(MenuController.prototype, 'show');

        controller = new MenuController();
        controller.showMenu(options);

        expect(show).toHaveBeenCalledWith(jasmine.any(MenuView), {
          region: options.region,
          loading: {
            style: 'none'
          }
        });
      });
    });

    describe(".navigateToLink", function() {
      it("should navigate to the given link", function() {
        var link = 'http://wordpress.example.org/about',
            navigate = spyOn(Navigator, 'navigate');

        controller = new MenuController();
        controller.navigateToLink({ link: link });

        expect(navigate).toHaveBeenCalledWith(link, true);
      });
    });
  });
});