define([
  'collections/term-collection'
], function (Terms) {
  describe("Terms", function() {
    beforeEach(function() {
      this.terms = new Terms();
    });

    it("should be defined", function() {
      expect(this.terms).toBeDefined();
    });
  });
});