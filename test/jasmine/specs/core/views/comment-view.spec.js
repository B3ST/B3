define([
  'views/comment-view',
  'models/comment-model',
  'models/user-model'
], function (CommentView, Comment, User) {
  describe("CommentView", function() {
    beforeEach(function() {
      this.comment = new Comment({
        ID:      1,
        content: 'Some Content',
        author:  new User({
          URL:  'user-url',
          name: 'some name'
        })
      });
      this.view = new CommentView({model: this.comment});
    });

    describe(".render", function() {
      it("should render the template", function() {
        this.view.render();
        expect(this.view.el).toBeDefined();
      });
    });
  });
});