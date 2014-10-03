/* global define */

define([
  "models/media-model",
  "models/base-model"
], function (Media, BaseModel) {
  "use strict";

  describe("Media", function() {
    var model;

    it("should extend from BaseModel", function() {
      expect(inherits(Media, BaseModel)).toBeTruthy();
    });

    describe("When initializing Media", function() {
      beforeEach(function() {
        model = new Media();
      });

      it("should have a null ID", function() {
        expect(model.get('ID')).toBeNull();
      });

      it("should have status set to inherit", function() {
        expect(model.get('status')).toEqual('inherit');
      });

      it("should have an attachment type", function() {
        expect(model.get('type')).toEqual('attachment');
      });

      it("should have no parent", function() {
        expect(model.get('parent')).toEqual(0);
      });

      it("should have 0 as menu_order", function() {
        expect(model.get('menu_order')).toEqual(0);
      });

      it("should have a standard format", function() {
        expect(model.get('format')).toEqual('standard');
      });

      it("should not be a sticky", function() {
        expect(model.get('sticky')).toBeFalsy();
      });

      it("should be an image", function() {
        expect(model.get('is_image')).toBeTruthy();
      });

      it("should have no terms", function() {
        expect(model.get('terms')).toEqual([]);
      });

      it("should have author defined", function() {
        expect(model.get('author') instanceof Backbone.Model).toBeTruthy();
      });

      using('model fields', ['date', 'date_gmt', 'modified', 'modified_gmt'], function (field) {
        it("should have " + field + " defined", function() {
          expect(model.get(field) instanceof Date).toBeTruthy();
        });
      });

      using('model fields', ['date_tz', 'modified_tz'], function (field) {
        it('should have ' + field + ' set to Etc/UTC', function() {
          expect(model.get(field)).toEqual('Etc/UTC');
        });
      });

      using('model fields', ['comment_status', 'ping_status'], function (field) {
        it("should have an open " + field, function() {
          expect(model.get(field)).toEqual('open');
        });
      });

      using('model fields', ['image_meta', 'meta'], function (field) {
        it("should have an empty " + field + " object", function() {
          expect(model.get(field)).toEqual({});
        });
      });

      using('model fields', ['title', 'content', 'link', 'slug', 'guid', 'excerpt', 'source'], function (field) {
        it("should have an empty " + field, function() {
          expect(model.get(field)).toEqual('');
        });
      });
    });
  });
});
