/* global define */

define([
  "models/comment-model",
  "models/base-model",
], function (Comment, BaseModel) {
  "use strict";

  describe("Comment", function() {
    var model;

    it("should inherit from BaseModel", function() {
      expect(inherits(Comment, BaseModel)).toBeTruthy();
    });

    describe("When initializing a Comment", function() {
      beforeEach(function() {
        model = new Comment();
      });

      it("should have a hold status", function() {
        expect(model.get('status')).toEqual('hold');
      });

      it("should have author defined", function() {
        expect(model.get('author') instanceof Backbone.Model).toBeTruthy();
      });

      it("should have empty meta", function() {
        expect(model.get('meta')).toEqual({});
      });

      it("should have no parent", function() {
        expect(model.get('parent')).toEqual(0);
      });

      using('model fields', ['ID', 'post'], function (field) {
        it("should have a null " + field, function() {
          expect(model.get(field)).toBeNull();
        });
      });

      using('model fields', ['date', 'date_gmt'], function (field) {
        it("should have " + field + " defined", function() {
          expect(model.get(field) instanceof Date).toBeTruthy();
        });
      });

      using('model fields', ['content', 'type'], function (field) {
        it("should have an empty " + field, function() {
          expect(model.get(field)).toEqual('');
        });
      });
    });
  });
});
