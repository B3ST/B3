/* global define */

define([
  'models/sidebar-model',
  'collections/widget-collection'
], function (Sidebar, Widgets) {
  'use strict';

  describe("Sidebar", function() {
    describe(".initialize", function() {
      beforeEach(function() {
        this.model = new Sidebar();
      });

      using('model fields', ['name', 'id', 'description', 'class'], function (field) {
        it("should have an empty " + field, function() {
          expect(this.model.get(field)).toEqual('');
        });
      });

      it("should have the widgets empty", function() {
        expect(this.model.get('widgets')).toEqual([]);
      });

      it("should have the meta empty", function() {
        expect(this.model.get('meta')).toEqual({});
      });
    });

    describe(".getWidgets", function() {
      beforeEach(function() {
        this.attrs = {"name":"Sidebar","id":"sidebar","description":"Default sidebar.","class":"","widgets":[{"widget_id":"archives-3","widget_name":"Archives","widget_title":"","class":["widget_archive"],"widget_content":"<!-- Archives -->\t\t<ul>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2014\/05'>May 2014<\/a>&nbsp;(6)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2013\/03'>March 2013<\/a>&nbsp;(7)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2013\/01'>January 2013<\/a>&nbsp;(14)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2012\/12'>December 2012<\/a>&nbsp;(12)<\/li>\n\t<li><a href='http:\/\/localhost:8888\/wordpress\/post\/2012\/11'>November 2012<\/a>&nbsp;(2)<\/li>\n\t\t<\/ul>\n"}],"meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/b3:sidebars\/sidebar"}}};
        this.model = new Sidebar(this.attrs);
      });

      it("should return the widgets", function() {
        var widgets = this.model.getWidgets();

        expect(widgets instanceof Widgets).toBeTruthy();
        expect(widgets.models[0].attributes).toEqual(this.attrs.widgets[0]);
      });
    });
  });
});