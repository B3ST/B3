/* global define */

define([
  'views/sidebar-view',
  'models/sidebar-model',
  'buses/event-bus'
], function (SidebarView, Sidebar, EventBus) {
  'use strict';

  describe("SidebarView", function() {
    var view, model;

    beforeEach(function() {
      var attrs = {"name":"Sidebar","id":"sidebar","description":"Default sidebar.","class":"","widgets":[{"widget_id":"archives-3","widget_name":"Archives","widget_title":"","class":["widget_archive"],"widget_content":"<!-- Archives -->\t\t<ul>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2014\/05'>May 2014<\/a>&nbsp;(6)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2013\/03'>March 2013<\/a>&nbsp;(7)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2013\/01'>January 2013<\/a>&nbsp;(14)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2012\/12'>December 2012<\/a>&nbsp;(12)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2012\/11'>November 2012<\/a>&nbsp;(2)<\/li>\n\t\t<\/ul>\n"}, {"widget_id":"archives-3", "widget_name":"Archives", "widget_title":"", "class":["widget_archive"], "widget_content":"<!-- Archives -->\t\t<ul>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2014\/05'>May 2014<\/a>&nbsp;(6)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2013\/03'>March 2013<\/a>&nbsp;(7)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2013\/01'>January 2013<\/a>&nbsp;(14)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2012\/12'>December 2012<\/a>&nbsp;(12)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2012\/11'>November 2012<\/a>&nbsp;(2)<\/li>\n\t\t<\/ul>\n"}],"meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/b3:sidebars\/sidebar"}}};
      model = new Sidebar(attrs);
      view  = new SidebarView({ model: model, template: 'widget-areas/sidebar-template.dust' });
    });

    describe("When rendering the sidebar", function() {
      it("should display the widgets", function() {
        view.render();
        expect(view.$el.children('.widget').length).toEqual(2);
      });
    });

    describe("When clicking in a link", function() {
      it("should trigger a sidebar:view:link event", function() {
        var bus = spyOn(EventBus, 'trigger');

        view.render();

        var link = view.$('a').first();
        link.click();
        expect(bus).toHaveBeenCalledWith('sidebar:view:link', { link: link.attr('href') });
      });
    });
  });
});