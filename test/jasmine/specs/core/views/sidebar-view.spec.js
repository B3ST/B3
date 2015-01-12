/* global define */

define([
  'views/sidebar-view',
  'models/sidebar-model',
  'buses/navigator'
], function (SidebarView, Sidebar, Navigator) {
  'use strict';

  describe('SidebarView', function() {
    var view, model;

    beforeEach(function() {
      var attrs = getJSONFixture('sidebar.json');
      model = new Sidebar(attrs);
      view  = new SidebarView({ model: model, template: 'widget-areas/sidebar-template.dust' });
    });

    describe('When rendering the sidebar', function() {
      it('should display the widgets', function() {
        view.render();
        expect(view.$el.children('.widget').length).toEqual(2);
      });
    });

    describe('When clicking in a link', function() {
      it('should trigger a sidebar:view:link event', function() {
        var navigate = spyOn(Navigator, 'navigateToLink'), link;
        view.render();

        link = view.$('a').first();
        link.click();

        expect(navigate).toHaveBeenCalledWith(link.attr('href'), true);
      });
    });
  });
});