/* global define */

define([
  'models/widget-model'
], function (Widget) {
  'use strict';

  describe("Widget", function() {
    beforeEach(function() {
      this.model = new Widget();
    });

    describe(".initialize", function() {
      using('model fields', ['widget_id', 'widget_name', 'widget_title', 'widget_content'], function (field) {
        it("should have an empty " + field, function() {
          expect(this.model.get(field)).toEqual('');
        });
      });

      it("should have an empty class", function() {
        expect(this.model.get('class')).toEqual([]);
      });
    });
  });
});