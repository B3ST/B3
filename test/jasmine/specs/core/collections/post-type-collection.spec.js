define([
  'collections/post-type-collection'
], function (PostTypes) {
  describe("PostTypes", function() {
    beforeEach(function() {
      this.types = new PostTypes();
    });

    it("should be defined", function() {
      expect(this.types).toBeDefined();
    });
  });
});