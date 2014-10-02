define([
  "models/page-model",
], function (Page) {
  "use strict";

  describe("Page", function() {
    var model;

    describe("When initializing a Page", function() {
      beforeEach(function() {
        model = new Page();
      });

      it("should have a null ID", function() {
        expect(model.get('ID')).toBeNull();
      });

      it("should have a draft status", function() {
        expect(model.get('status')).toEqual('draft');
      });

      it("should have a page type", function() {
        expect(model.get('type')).toEqual('page');
      });

      it("should have a standard format", function() {
        expect(model.get('format')).toEqual('standard');
      });

      it("should have no parent", function() {
        expect(model.get('parent')).toEqual(0);
      });

      it("should have menu_order set to 0", function() {
        expect(model.get('menu_order')).toEqual(0);
      });

      it("should have a closed comment_status", function() {
        expect(model.get('comment_status')).toEqual('closed');
      });

      it("should have an open ping_status", function() {
        expect(model.get('ping_status')).toEqual('open');
      });

      it("should not be sticky", function() {
        expect(model.get('sticky')).toBeFalsy();
      });

      it("should have empty terms", function() {
        expect(model.get('terms')).toEqual([]);
      });

      it("should have author defined", function() {
        expect(model.get('author') instanceof Backbone.Model).toBeTruthy();
      });

      it("should have empty meta", function() {
        expect(model.get('meta')).toEqual({});
      });

      using('model fields', ['date', 'date_gmt', 'modified', 'modified_gmt'], function (field) {
        it("should have " + field + " defined", function() {
          expect(model.get(field) instanceof Date).toBeTruthy();
        });
      });

      using('model fields', ['date_tz', 'modified_tz'], function (field) {
        it("should have " + field + " set to Etc/UTC", function() {
          expect(model.get(field)).toEqual('Etc/UTC');
        });
      });

      using('model fields', ['title', 'content', 'link', 'slug', 'guid', 'excerpt'], function (field) {
        it("should have an empty " + field, function() {
          expect(model.get(field)).toEqual('');
        });
      });
    });
  });
});
