define([
  'collections/page-collection'
], function (Pages) {
  describe("Pages", function() {
    beforeEach(function() {
      this.pages = new Pages();
    });

    it("should be defined", function() {
      expect(this.pages).toBeDefined();
    });
  });
});