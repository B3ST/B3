define([
  'views/comment-view',
  'models/comment-model',
  'models/post-model',
  'models/user-model',
  'buses/navigator',
], function (CommentView, Comment, Post, User, Navigator) {
  'use strict';

  describe("CommentView", function() {
    var view, comment;

    beforeEach(function() {
      var user = new User({ID: 1, URL: 'user-url', name: 'some-name', slug: 'author-slug'}),
          post = new Post({ID: 1, comment_status: 'open'});

      comment = new Comment({
        ID:      1,
        post:    post,
        content: 'Some Content',
        author:  user
      });
    });

    describe("When clicking in author", function() {
      it("should trigger a navigation event", function() {
        var bus = spyOn(Navigator, 'navigateToAuthor');

        view = new CommentView({ model: comment });
        view.user = this.user;
        view.render();

        view.$('.comment-author').click();
        expect(bus).toHaveBeenCalledWith('author-slug', null, true);
      });
    });
  });
});