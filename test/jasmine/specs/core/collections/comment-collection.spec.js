define([
  'collections/comment-collection'
], function (Comments) {
  describe("Comments", function() {
    beforeEach(function() {
      this.comments = new Comments();
    });

    it("should be defined", function() {
      expect(this.comments).toBeDefined();
    });
  });
});