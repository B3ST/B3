/* global define */

define([
  'views/sidebar-view',
  'models/sidebar-model',
  'sinon'
], function (SidebarView, Sidebar) {
  'use strict';

  describe("SidebarView", function() {
    describe(".initialize", function() {
      it("should fetch the model", function() {
        this.spy   = spyOn(Sidebar.prototype, 'fetch');
        this.model = new Sidebar();
        this.view  = new SidebarView({model: this.model});

        expect(this.spy).toHaveBeenCalled();
      });
    });

    describe(".render", function() {
      beforeEach(function() {
        var attrs = {"name":"Sidebar","id":"sidebar","description":"Default sidebar.","class":"","widgets":[{"widget_id":"archives-3","widget_name":"Archives","widget_title":"","class":["widget_archive"],"widget_content":"<!-- Archives -->\t\t<ul>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2014\/05'>May 2014<\/a>&nbsp;(6)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2013\/03'>March 2013<\/a>&nbsp;(7)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2013\/01'>January 2013<\/a>&nbsp;(14)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2012\/12'>December 2012<\/a>&nbsp;(12)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2012\/11'>November 2012<\/a>&nbsp;(2)<\/li>\n\t\t<\/ul>\n"}, {"widget_id":"archives-3", "widget_name":"Archives", "widget_title":"", "class":["widget_archive"], "widget_content":"<!-- Archives -->\t\t<ul>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2014\/05'>May 2014<\/a>&nbsp;(6)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2013\/03'>March 2013<\/a>&nbsp;(7)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2013\/01'>January 2013<\/a>&nbsp;(14)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2012\/12'>December 2012<\/a>&nbsp;(12)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2012\/11'>November 2012<\/a>&nbsp;(2)<\/li>\n\t\t<\/ul>\n"}],"meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/b3:sidebars\/sidebar"}}};
        this.model = new Sidebar(attrs);
        this.view  = new SidebarView({model: this.model});
      });

      it("should display the widgets", function() {
        this.view.render();

        expect(this.view.$el.children('.widget').length).toEqual(2);

        var widget = this.view.$('.widget')[0],
            model  = this.model.get('widgets')[0];
        expect($(widget).find('div.widget-body').text()).not.toEqual('');
      });
    });
  });
});