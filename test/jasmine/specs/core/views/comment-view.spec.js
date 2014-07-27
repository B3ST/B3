define([
  'views/comment-view',
  'models/comment-model',
  'models/post-model',
  'models/user-model',
  'views/reply-form-view'
], function (CommentView, Comment, Post, User, ReplyFormView) {
  describe("CommentView", function() {
    beforeEach(function() {
      this.user = new User({ URL: 'user-url', name: 'some name' });
      this.post = new Post({ID: 1, comment_status: 'open'});
      this.comment = new Comment({
        ID:      1,
        post:    this.post,
        content: 'Some Content',
        author:  this.user
      });
      this.view      = new CommentView({model: this.comment});
      this.view.user = this.user;
    });

    describe(".render", function() {
      it("should render the template", function() {
        this.view.render();
        expect(this.view.el).toBeDefined();
      });
    });

    describe("Clicking reply", function() {
      it("should display a comment box", function() {
        var that       = this;

        this.view      = new CommentView({model: this.comment});
        this.view.user = this.user;
        this.view.render();

        var template = new ReplyFormView({
          parentView: this.view,
          user:       this.user,
          model:      this.post,
          parentId:   this.comment.get('ID')
        }).render().el;

        $(template).slideDown();

        var button = this.view.$('.b3-reply-comment');
        var box;

        runs(function() {
          button.click();
        });

        waitsFor(function() {
          box = $(button).next('#b3-replyform');
          return box.length > 0;
        }, "the comment form to appear", 750);

        runs(function() {
          expect(box[0].isEqualNode(template)).toBeTruthy();
        });
      });
    });
  });
});