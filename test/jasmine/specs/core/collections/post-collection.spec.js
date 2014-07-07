define([
  'collections/post-collection'
], function (Posts) {
  describe("Posts", function() {
    beforeEach(function() {
      this.posts = new Posts();
    });

    it("should be defined", function() {
      expect(this.posts).toBeDefined();
    });
  });
});