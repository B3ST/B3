define([
  'jquery',
  'views/comment-view',
  'models/comment-model',
  'models/post-model',
  'models/user-model',
  'controllers/bus/event-bus',
  'views/reply-form-view'
], function ($, CommentView, Comment, Post, User, EventBus, ReplyFormView) {
  'use strict';

  describe("CommentView", function() {
    beforeEach(function() {
      this.bus  = spyOn(EventBus, 'trigger');
      this.user = new User({ID: 1, URL: 'user-url', name: 'some-name', slug: 'author-slug'});
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

    describe("When clicking in reply", function() {
      beforeEach(function() {
        $.fx.off = true;
      });

      it("should display a comment box", function() {
        this.view      = new CommentView({model: this.comment});
        this.view.user = this.user;
        this.view.render();

        var template = new ReplyFormView({
          parentView: this.view,
          user:       this.user,
          model:      this.post,
          parentId:   this.comment.get('ID')
        }).render().el;

        $(template).show();

        var button = this.view.$('.b3-reply-comment');
        button.click();

        var box = $(button).next('#b3-replyform');
        expect(box[0].isEqualNode(template)).toBeTruthy();
      });
    });

    describe("When clicking in author", function() {
      it("should trigger a navigation event", function() {
        this.view = new CommentView({model: this.comment});
        this.view.render();

        this.view.$('.b3-comment-author').click();
        expect(this.bus).toHaveBeenCalledWith('router:nav', {route: 'post/author/author-slug', options: {trigger: true}});
      });
    });
  });
});