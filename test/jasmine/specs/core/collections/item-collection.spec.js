define([
  'collections/item-collection'
], function (Items) {
  describe("Items", function() {
    it("should be defined", function() {
      this.items = new Items();
      expect(this.items).toBeDefined();
    });
  });
});