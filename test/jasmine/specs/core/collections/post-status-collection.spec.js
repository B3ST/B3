define([
  'collections/post-status-collection'
], function (PostStatuses) {
  describe("PostStatuses", function() {
    beforeEach(function() {
      this.statuses = new PostStatuses();
    });

    it("should be defined", function() {
      expect(this.statuses).toBeDefined();
    });
  });
});