define([
  'views/comment-view',
  'models/comment-model',
  'models/post-model',
  'models/user-model',
  'views/reply-form-view'
], function (CommentView, Comment, Post, User, ReplyFormView) {
  describe("CommentView", function() {
    beforeEach(function() {
      this.post = new Post({ID: 1});
      this.comment = new Comment({
        ID:      1,
        post:    this.post,
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

    describe("When clicking in reply", function() {
      it("should display a comment box", function() {
        this.view = new CommentView({model: this.comment});
        this.view.render();

        this.view.$('a.b3-reply-comment').click();

        var template = new ReplyFormView({parentView: this.view, parentId: this.comment.get('ID')}).render().el;
        var box      = this.view.$('.b3-reply-section').children()[0];
        expect(box.isEqualNode(template)).toBeTruthy();
      });
    });
  });
});