define([
  'collections/post-collection',
  'collections/base-collection'
], function (Posts, BaseCollection) {

  describe("Posts", function() {
    var posts;

    it("should extend from BaseCollection", function() {
      expect(inherits(Posts, BaseCollection)).toBeTruthy();
    });

    it("should bind to heartbeat:posts", function() {
      posts = new Posts();
      expect(posts.heartbeat).toEqual('heartbeat:posts');
    });
  });
});