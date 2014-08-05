/* global define, jasmine, sinon, describe, beforeEach, afterEach, expect, it, using, spyOn */

define([
  'jquery',
  'backbone',
  'views/reply-form-view',
  'controllers/bus/event-bus',
  'models/settings-model',
  'models/user-model',
  'models/comment-model',
  'models/post-model',
  'sinon'
], function ($, Backbone, ReplyFormView, EventBus, Settings, User, Comment, Post) {
  'use strict';

  describe("ReplyFormView", function() {
    beforeEach(function() {
      this.parentView = jasmine.createSpyObj('parentView', ['replyFormRendered', 'replyFormDestroyed', 'replyFormCancelled']);
      this.user       = new User({ID: 1, name: 'name'});
      this.post       = new Post({ID: 1, comment_status: 'open'});
    });

    describe(".initialize", function() {
      it("should set its parent view", function() {
        this.view = new ReplyFormView({post: this.post, parentView: this.parentView, user: this.user});
        expect(this.view.parentView).toEqual(this.parentView);
      });
    });

    describe(".render", function() {
      beforeEach(function() {
        this.view = new ReplyFormView({post: this.post, parentView: this.parentView, user: this.user});
        this.view.render();
      });

      it("should render the template", function() {
        expect(this.view.el).toBeDefined();
      });

      it("should tell the parent view that the view was rendered", function() {
        expect(this.parentView.replyFormRendered).toHaveBeenCalled();
      });

      describe("while the user is logged in", function() {
        it("should hide the form for name and user email", function() {
          this.view = new ReplyFormView({post: this.post, parentView: this.parentView, user: this.user});
          this.view.render();

          expect(this.view.$('#b3-author').length).toEqual(0);
        });
      });

      describe("while the user is not logged in", function() {
        it("should display a form for name and user email", function() {
          this.user = new User();
          this.view = new ReplyFormView({post: this.post, parentView: this.parentView, user: this.user});
          this.view.render();

          expect(this.view.$('#b3-author').length).toEqual(1);
        });
      });
    });

    describe("Clicking the cancel button", function() {
      beforeEach(function() {
        this.view = new ReplyFormView({post: this.post, parentView: this.parentView, user:this.user});
        this.view.render();

        this.view.$('#b3-cancel').click();
      });

      it("should hide the view", function() {
        expect(this.view.$el.is(':visible')).toBeFalsy();
      });

      it("should tell the parent view that the view was destroyed", function() {
        expect(this.parentView.replyFormCancelled).toHaveBeenCalled();
      });
    });

    describe("Clicking the reply button", function() {
      beforeEach(function() {
        this.requests = [];
        this.xhr = sinon.useFakeXMLHttpRequest();
        this.xhr.onCreate = $.proxy(function(xhr) {
          this.requests.push(xhr);
        }, this);

        this.eventBus = spyOn(EventBus, 'trigger');
        this.view = new ReplyFormView({post: this.post, parentView: this.parentView, user: this.user, parentId: 0});
        this.view.render();

        this.view.$('[name="comment_content"]').val('Some reply');
      });

      afterEach(function() {
        this.xhr.restore();
      });

      xit("should tell the parent view that the view was destroyed", function() {
        this.view.$('#b3-replybutton').click();
        expect(this.parentView.replyFormDestroyed).toHaveBeenCalled();
      });

      describe("while the user is logged in", function() {
        it("should create a comment for the given post associated with that user", function() {
          var comment = new Comment({
            content:        'Some reply',
            post:           this.post.get('ID'),
            parent_comment: 0,
            author:         this.user
          });
          this.view.$('#b3-replybutton').click();
          expect(JSON.parse(this.requests[0].requestBody)).toEqual(comment.toJSON());
        });

        it("should trigger an event for the newly created comment", function() {
          this.xhr.restore();

          var response = {"ID":59,"post":1,"content":"<p>reply to the post<\/p>\n","status":"approved","type":"comment","parent":0,"author":1,"date":"2014-07-23T09:10:51+00:00","date_tz":"UTC","date_gmt":"2014-07-23T09:10:51+00:00","meta":{"links":{"up":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/16","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/b3:comments\/59"}}};
          this.server = sinon.fakeServer.create();
          this.server.respondWith(
            'POST',
            Settings.get('apiUrl') + '/posts/1/b3:replies/',
            [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.view.$('#b3-replybutton').click();
          this.server.respond();

          expect(this.eventBus).toHaveBeenCalledWith('comment:create', jasmine.any(Comment));
        });

        describe("and there is no comment text", function() {
          beforeEach(function() {
            this.view.$('[name="comment_content"]').val('');
            this.view.$('#b3-replybutton').click();
          });

          it("should not create a comment", function() {
            expect(this.requests.length).toEqual(0);
          });

          it("should display a warning", function() {
            expect(this.view.$('#b3-warning').text()).not.toEqual('');
          });
        });
      });

      describe("when user is not logged in", function() {
        beforeEach(function() {
          this.user = new User();
          this.view = new ReplyFormView({post: this.post, parentView: this.parentView, user: this.user, parentId: 0});
          this.view.render();

          this.view.$('[name="comment_content"]').val('Some reply');
          this.view.$('[name="author_name"]').val('Author Name');
          this.view.$('[name="author_email"]').val('author@email.com');
          this.view.$('[name="author_url"]').val('http://log.pt/');
        });

        it("should create a comment with the given name and email", function() {
          var user = new User({name: 'Author Name', email: 'author@email.com', URL: 'http://log.pt/'});
          var comment = new Comment({
            content:        'Some reply',
            post:           this.post.get('ID'),
            parent_comment: 0,
            author:         user
          });

          this.view.$('#b3-replybutton').click();
          expect(JSON.parse(this.requests[0].requestBody)).toEqual(comment.toJSON());
        });

        using('view fields', ['author_name', 'author_email'], function (field) {
          describe("and " + field + " is missing", function() {
            beforeEach(function() {
              this.view.$('[name="comment_content"]').val('Some reply');

              this.view.$('[name="' + field + '"]').val('');
              this.view.$('#b3-replybutton').click();
            });

            it("should not create a comment", function() {
              expect(this.requests.length).toEqual(0);
            });

            it("should display a warning", function() {
              expect(this.view.$('#b3-warning').text()).not.toEqual('');
            });
          });
        });
      });
    });
  });
});
