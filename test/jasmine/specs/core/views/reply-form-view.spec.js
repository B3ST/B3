/* global define, jasmine, sinon, describe, beforeEach, afterEach, expect, it, using, spyOn */

define([
  'jquery',
  'backbone',
  'views/reply-form-view',
  'buses/event-bus',
  'models/settings-model',
  'models/user-model',
  'models/comment-model',
  'models/post-model',
], function ($, Backbone, ReplyFormView, EventBus, Settings, User, Comment, Post) {
  'use strict';

  describe("ReplyFormView", function() {
    var user, post, view, options;

    beforeEach(function() {
      user    = new User({ID: 1, name: 'name'});
      post    = new Post({ID: 1, comment_status: 'open'});
      options = { post: post, user: user, parentId: 1 };
    });

    describe(".render", function() {
      describe("while the user is logged in", function() {
        it("should hide the form for name and user email", function() {
          view = new ReplyFormView(options);
          view.render();

          expect(view.$('#author').length).toEqual(0);
        });
      });

      describe("while the user is not logged in", function() {
        it("should display a form for name and user email", function() {
          user = new User();
          view = new ReplyFormView({ post: post, user: new User(), parentId: 1 });
          view.render();

          expect(view.$('#author').length).toEqual(1);
        });
      });
    });

    describe("Clicking the cancel button", function() {
      beforeEach(function() {
        view = new ReplyFormView(options);
        view.render();
      });

      it("should hide the view", function() {
        view.$('.cancel').click();
        expect(view.$el.is(':visible')).toBeFalsy();
      });

      it("should trigger a replyform:view:cancel event", function() {
        var trigger = spyOn(EventBus, 'trigger');
        view.$('.cancel').click();
        expect(trigger).toHaveBeenCalledWith('replyform:view:cancel');
      });
    });

    describe("Clicking the reply button", function() {
      beforeEach(function() {
        view = new ReplyFormView(options);
        view.render();
      });

      describe("while the user is logged in", function() {
        beforeEach(function() {
          view.$('[name="comment_content"]').val('Some reply');
        });

        it("should trigger a replyform:view:reply", function() {
          var bus = spyOn(EventBus, 'trigger');
          view.$('.reply').click();
          expect(bus).toHaveBeenCalledWith('replyform:view:reply', {
            content:        'Some reply',
            post:           post.get('ID'),
            parent_comment: 1,
            author:         user
          });
        });

        describe("and there is no comment text", function() {
          beforeEach(function() {
            view.$('[name="comment_content"]').val('');
            view.$('.reply').click();
          });

          it("should display a warning", function() {
            expect(view.$('#warning').text()).not.toEqual('');
          });
        });
      });

      describe("when user is not logged in", function() {
        beforeEach(function() {
          user = new User();
          view = new ReplyFormView({post: post, parentView: this.parentView, user: user, parentId: 0});
          view.render();

          view.$('[name="comment_content"]').val('Some reply');
          view.$('[name="author_name"]').val('Author Name');
          view.$('[name="author_email"]').val('author@email.com');
          view.$('[name="author_url"]').val('http://log.pt/');
        });

        it("should trigger a replyform:view:reply with the given name and email", function() {
          var bus = spyOn(EventBus, 'trigger');

          view.$('.reply').click();
          expect(bus).toHaveBeenCalledWith('replyform:view:reply', {
            content:        'Some reply',
            post:           post.get('ID'),
            parent_comment: 0,
            author:         jasmine.any(User)
          });
        });

        using('view fields', ['author_name', 'author_email'], function (field) {
          describe("and " + field + " is missing", function() {
            beforeEach(function() {
              view.$('[name="comment_content"]').val('Some reply');

              view.$('[name="' + field + '"]').val('');
              view.$('.reply').click();
            });

            it("should display a warning", function() {
              expect(view.$('#warning').text()).not.toEqual('');
            });
          });
        });
      });
    });
  });
});
