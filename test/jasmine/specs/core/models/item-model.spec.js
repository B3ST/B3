define([
  'models/item-model'
], function (Item) {
  describe("Item", function() {
    describe(".initialize", function() {
      beforeEach(function() {
        this.item = new Item();
      });

      using('model fields', ['ID', 'object'], function (field) {
        it("should have a null " + field, function() {
          expect(this.item.get(field)).toBeNull();
        });
      });

      using('model fields', ['parent', 'order', 'object_parent'], function (field) {
        it("should have " + field + " set to zero", function() {
          expect(this.item.get(field)).toEqual(0);
        });
      });

      using('model fields', ['type', 'guid', 'object_type', 'link', 'title', 'attr_title', 'description', 'target', 'xfn'], function (field) {
        it("should have an empty " + field, function() {
          expect(this.item.get(field)).toEqual('');
        });
      });

      it("should have empty classes", function() {
        expect(this.item.get('classes')).toEqual([]);
      });

      it("should have empty meta", function() {
        expect(this.item.get('meta')).toEqual({});
      });
    });
  });
});