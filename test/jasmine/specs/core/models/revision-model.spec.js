/* global define */

define([
  "models/revision-model",
  "models/base-model"
], function (Revision, BaseModel) {
  "use strict";

  describe("Revision", function() {
    var model;

    it("should extend from BaseModel", function() {
      expect(inherits(Revision, BaseModel)).toBeTruthy();
    });

    describe("When initializing Revision", function() {
      beforeEach(function() {
        model = new Revision();
      });

      using('model fields', ['ID', 'post', 'slug'], function (field) {
        it("should have null " + field, function() {
          expect(model.get(field)).toBeNull();
        });
      });

      using('model fields', ['title', 'content', 'link', 'guid', 'excerpt'], function (field) {
        it("should have an empty " + field, function() {
          expect(model.get(field)).toEqual('');
        });
      });

      using('model fields', ['parent', 'menu_order'], function (field) {
        it("should have default " + field + " as 0", function() {
          expect(model.get(field)).toEqual(0);
        });
      });

      using('model fields', ['date', 'modified', 'date_gmt', 'modified_gmt'], function (field) {
        it("should have " + field + " defined", function() {
          expect(model.get(field) instanceof Date).toBeTruthy();
        });
      });

      it("should have an author defined", function() {
        expect(model.get('author') instanceof Backbone.Model).toBeTruthy();
      });

      it("should have an empty meta object", function() {
        expect(model.get('meta')).toEqual({});
      });

      it("should have a standard format", function() {
        expect(model.get('format')).toEqual('standard');
      });

      it("should have a inherit status", function() {
        expect(model.get('status')).toEqual('inherit');
      });

      it("should have a revision type", function() {
        expect(model.get('type')).toEqual('revision');
      });
    });
  });
});
