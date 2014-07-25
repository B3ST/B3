define([
  'collections/menu-item-collection'
], function (MenuItems) {
  describe("MenuItems", function() {
    it("should be defined", function() {
      this.items = new MenuItems();
      expect(this.items).toBeDefined();
    });
  });
});