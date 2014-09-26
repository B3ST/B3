/* global define */

define([
  'views/comments-view',
  'collections/comment-collection',
  'models/comment-model',
  'models/post-model',
  'models/user-model'
], function (CommentsView, Comments, Comment, Post, User) {
  'use strict';

  describe("CommentsView", function() {
    var view, post, user;

    beforeEach(function() {
      post = new Post({ ID: 1 });
      user = new User({});
    });

    describe(".render", function() {
      it("should render the template", function() {
        view = new CommentsView({ model: post, collection: new Comments(), user: user });
        view.render();

        expect(view.el).toBeDefined();
      });

      describe("When there are replies to comments", function() {
        it("should nest the replies with the parent comment", function() {
          var comments = [
            new Comment({ID: 1, content: 'Comment content 1', status: 'approved'}),
            new Comment({ID: 2, content: 'Comment content 2', status: 'approved'}),
            new Comment({ID: 3, content: 'Comment 1 reply 1', status: 'approved', parent: 1}),
            new Comment({ID: 4, content: 'Comment 1 reply 2', status: 'approved', parent: 1}),
            new Comment({ID: 5, content: 'Comment 2 reply 2', status: 'approved', parent: 2}),
            new Comment({ID: 6, content: 'Reply 1 reply 1', status: 'approved', parent: 3}),
            new Comment({ID: 7, content: 'Reply 2 reply 1', status: 'approved', parent: 3}),
            new Comment({ID: 8, content: 'Reply 1 reply 2', status: 'approved', parent: 5})
          ];

          view = new CommentsView({
            model:      post,
            collection: new Comments(comments),
            user:       user
          });
          view.render();

          expect(view.$('.comments').children().length).toEqual(8);

          expect(view.$('#comment-1 > div.comment-body > ul.comments').children().length).toEqual(2);
          expect(view.$('#comment-2 > div.comment-body > ul.comments').children().length).toEqual(1);

          expect(view.$('#comment-3 > div.comment-body > ul.comments').children().length).toEqual(2);
          expect(view.$('#comment-5 > div.comment-body > ul.comments').children().length).toEqual(1);
        });
      });
    });
  });
});