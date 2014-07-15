define([
  'views/content-single-view',
  'models/post-model'
], function (ContentSingleView, Post) {
  describe("ContentSingleView", function() {
    beforeEach(function() {
      this.post = new Post({
        ID:      1,
        title:   'Title',
        content: 'Some Content'
      });
      this.view = new ContentSingleView(this.post);
      this.view.render();
    });

    it("should set the post", function() {
      expect(this.view.post).toEqual(this.post);
    });

    it("should render the template", function() {
      expect(this.view.el).toBeDefined();
      expect(this.view.$('.b3-pt').text()).toEqual('Title');
      expect(this.view.$('.b3-pc').text()).toEqual('Some Content');
    });
  });
});