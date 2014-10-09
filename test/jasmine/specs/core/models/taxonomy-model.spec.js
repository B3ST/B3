define([
  'models/taxonomy-model'
], function (Taxonomy) {
  "use strict";

  describe("Taxonomy", function() {
    var model;

    describe("When initializing Taxonomy", function() {
      beforeEach(function() {
        model = new Taxonomy();
      });

      it("should have an empty name", function() {
        expect(model.get('name')).toEqual('');
      });

      it("should have a null slug", function() {
        expect(model.get('slug')).toBeNull();
      });

      using('model fields', ['labels', 'types', 'meta'], function (field) {
        it("should have an empty " + field + " object", function() {
          expect(model.get(field)).toEqual({});
        });
      });

      using('model fields', ['show_cloud', 'hierarchical'], function (field) {
        it("should have a falsy " + field, function() {
          expect(model.get(field)).toBeFalsy();
        });
      });
    });
  });
});
