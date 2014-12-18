define([
  'collections/base-collection',
  'collections/comment-collection'
], function (BaseCollection, Comments) {

  describe("Comments", function() {
    beforeEach(function() {
      this.comments = new Comments({ uri: '' });
    });

    it("should extend from BaseCollection", function() {
      expect(inherits(Comments, BaseCollection)).toBeTruthy();
    });

    it("should have a heartbeat", function() {
      expect(this.comments.heartbeat).toEqual('heartbeat:comments');
    });

    it("should be defined", function() {
      expect(this.comments).toBeDefined();
    });
  });
});