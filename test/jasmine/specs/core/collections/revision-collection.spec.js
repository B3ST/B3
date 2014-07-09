define([
  'collections/revision-collection'
], function (Revisions) {
  describe("Revisions", function() {
    beforeEach(function() {
      this.revisions = new Revisions();
    });

    it("should be defined", function() {
      expect(this.revisions).toBeDefined();
    });
  });
});