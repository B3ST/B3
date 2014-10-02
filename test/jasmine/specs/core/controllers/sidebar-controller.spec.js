/* global define */

define([
  'controllers/sidebar-controller',
  'controllers/base-controller',
  'views/sidebar-view',
  'buses/navigator'
], function (SidebarController, BaseController, SidebarView, Navigator) {
  'use strict';

  describe("SidebarController", function() {
    var controller, options;

    beforeEach(function() {
      var region = jasmine.createSpyObj('region', ['show']);
      options = { region: region, template: 'template/template' };
    });

    it("should extend from BaseController", function() {
      expect(inherits(SidebarController, BaseController)).toBeTruthy();
    });

    it("should bind to a given set of events", function() {
      controller = new SidebarController();
      expect(controller.busEvents).toEqual({
        "sidebar:view:link": "navigate"
      });
    });

    describe(".showSidebar", function() {
      it("should display a no-style loading", function() {
        var show = spyOn(SidebarController.prototype, 'show');

        controller = new SidebarController();
        controller.showSidebar();

        expect(show).toHaveBeenCalledWith(jasmine.any(SidebarView), {
          loading: {
            style: 'none'
          }
        });
      });
    });

    describe(".navigate", function() {
      it("should navigate to the given link", function() {
        var navigate = spyOn(Navigator, "navigate");

        controller = new SidebarController();
        controller.navigate({ link: "link" });

        expect(navigate).toHaveBeenCalledWith('link', true);
      });
    });
  });
});