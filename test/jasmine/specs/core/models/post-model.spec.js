/* global define */

define([
  "models/post-model",
  "models/base-model",
  "models/term-model"
], function (Post, BaseModel, Term) {
  "use strict";

  describe("Post", function() {
    var model;

    it("should inherit from BaseModel", function() {
      expect(inherits(Post, BaseModel)).toBeTruthy();
    });

    describe("When instantiating a Post", function() {
      beforeEach(function() {
        model = new Post();
      });

      using('model fields', ['ID', 'featured_image'], function(field) {
        it("should have a null " + field, function() {
          expect(model.get(field)).toBeNull();
        });
      });

      using('model fields', ['author', 'date', 'date_gmt', 'modified'], function (field) {
        it("should have " + field + " defined", function() {
          expect(model.get(field)).toBeDefined();
        });
      });

      using('model fields', ['title', 'content', 'link', 'slug', 'guid', 'excerpt'], function(field) {
        it("should have an empty " + field, function() {
          expect(model.get(field)).toBe('');
        });
      });

      using('model fields', ['comment_status', 'ping_status'], function(field) {
        it("should have " + field + " open", function() {
          expect(model.get(field)).toBe('open');
        });
      });

      using('model fields', ['date_tz', 'modified_tz'], function(field) {
        it("should set " + field + " to Etc/UTC", function() {
          expect(model.get(field)).toBe('Etc/UTC');
        });
      });

      using('model fields', ['terms', 'post_meta', 'meta'], function(field) {
        it("should have an empty object for " + field, function() {
          expect(model.get(field)).toEqual({});
        });
      });

      it("should not be a parent", function() {
        expect(model.get('parent')).toEqual(0);
      });

      it("should have draft set for status", function() {
        expect(model.get('status')).toBe('draft');
      });

      it("should have post set for type", function() {
        expect(model.get('type')).toBe('post');
      });

      it("should not be a sticky", function() {
        expect(model.get('sticky')).toBeFalsy();
      });

      it("should have a standard format", function() {
        expect(model.get('format')).toBe('standard');
      });

      it("should have no menu_order", function() {
        expect(model.get('menu_order')).toBe(0);
      });
    });

    describe(".getTerm", function() {
      it("should return a given term", function() {
        model = new Post({ terms: { category: [{ slug: 'term' }] } } );
        expect(model.getTerm('category', 'term').attributes).toEqual(new Term({ slug: 'term' }).attributes);
      });
    });
  });
});
