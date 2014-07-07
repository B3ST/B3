define([
  'collections/taxonomy-collection'
], function (Taxonomies) {
  describe("Taxonomies", function() {
    beforeEach(function() {
      this.tax = new Taxonomies();
    });

    it("should be defined", function() {
      expect(this.tax).toBeDefined();
    });
  });
});