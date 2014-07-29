/* global define, sinon, describe, beforeEach, expect, it, spyOn */

define([
  'jquery',
  'views/single-post-view',
  'controllers/event-bus',
  'views/reply-form-view',
  'models/user-model',
  'models/post-model',
  'models/comment-model',
  'collections/comment-collection',
  'sinon'
], function ($, SinglePostView, EventBus, ReplyFormView, User, Post, Comment, Comments) {
  'use strict';

  function sharedBehaviourFor (action, options) {
    describe("When clicking in " + action, function() {
      it("should trigger an event of navigation", function() {
        this.spy = spyOn(EventBus, 'trigger');
        this.post = new Post({ID: 1, title: 'Title', terms: {category: {ID: 1, slug: 'post-1', link: "http://localhost:8888/wordpress/post/category/content"}, post_tag: {ID: 1, slug: 'tag-1', link: "http://localhost:8888/wordpress/post/tag/content"}}});
        this.view = new SinglePostView({model: this.post, user: this.user});
        this.view.render();

        this.view.$(options.click).click();
        expect(this.spy).toHaveBeenCalledWith('router:nav', {route: options.route, options: {trigger: true}});
      });
    });
  }

  describe("SinglePostView", function() {
    beforeEach(function() {
      this.user = new User();
    });

    describe(".initialize", function() {
      it("should bind to a given set of events", function() {
        this.spy = spyOn(EventBus, 'bind');
        this.post = new Post({ID: 1});
        this.view = new SinglePostView({model: this.post, collection: new Comments(), user: this.user});

        expect(this.spy).toHaveBeenCalledWith('comment:create', this.view.addComment);
      });

      it("should set the document title", function () {
        this.spy = spyOn(EventBus, 'trigger');
        this.post = new Post({ID: 1, title: 'Title'});
        this.view = new SinglePostView({model: this.post, user: this.user});

        expect(this.spy).toHaveBeenCalledWith('title:change', 'Title');
      });

      it("should fetch the corresponding post comments", function() {
        this.spy  = spyOn(Post.prototype, 'fetchComments');
        this.post = new Post({
          ID:      1,
          title:   'Title',
          content: 'Some Content'
        });
        this.view = new SinglePostView({model: this.post, collection: new Comments(), user: this.user});
        this.view.render();

        expect(this.spy).toHaveBeenCalled();
      });

      describe("When fetching comments", function() {
        beforeEach(function() {
          this.url  = 'http://root.org/post/1/comments';
          this.post = new Post({
            ID:      1,
            title:   'Title',
            content: 'Some Content',
            meta: {
              links: {
                replies: this.url
              }
            }
          });
        });

        describe("When fetching is successful", function() {
          it("should display the comments", function() {
            var response = [
              new Comment({ID: 1, content: 'Comment content 1', status: 'approved'}).toJSON(),
              new Comment({ID: 2, content: 'Comment content 2', status: 'approved'}).toJSON()
            ];
            this.server = sinon.fakeServer.create();
            this.server.respondWith(
              'GET',
              this.url + '/',
              [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
            );

            this.view = new SinglePostView({model: this.post, collection: new Comments(), user: this.user});
            this.view.render();

            this.server.respond();
            expect(this.view.$('.b3-comments').children().length).toEqual(2);
            expect(this.view.$('.b3-comment-content').length).toEqual(2);
          });

          describe("When there are replies to comments", function() {
            it("should nest the replies with the parent comment", function() {
              var response = [
                new Comment({ID: 1, content: 'Comment content 1', status: 'approved'}).toJSON(),
                new Comment({ID: 2, content: 'Comment content 2', status: 'approved'}).toJSON(),
                new Comment({ID: 3, content: 'Comment 1 reply 1', status: 'approved', parent: 1}).toJSON(),
                new Comment({ID: 4, content: 'Comment 1 reply 2', status: 'approved', parent: 1}).toJSON(),
                new Comment({ID: 5, content: 'Comment 2 reply 2', status: 'approved', parent: 2}).toJSON(),
                new Comment({ID: 6, content: 'Reply 1 reply 1', status: 'approved', parent: 3}).toJSON(),
                new Comment({ID: 7, content: 'Reply 2 reply 1', status: 'approved', parent: 3}).toJSON(),
                new Comment({ID: 8, content: 'Reply 1 reply 2', status: 'approved', parent: 5}).toJSON()
              ];

              this.server = sinon.fakeServer.create();
              this.server.respondWith(
                'GET',
                this.url + '/',
                [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
              );

              this.view = new SinglePostView({model: this.post, collection: new Comments(), user: this.user});
              this.view.render();

              this.server.respond();
              expect(this.view.$('.b3-comments').children().length).toEqual(8);
              expect(this.view.$('.b3-comment-content').length).toEqual(8);

              expect(this.view.$('#comment-1 > div.b3-comment-content > ul.b3-comments').children().length).toEqual(2);
              expect(this.view.$('#comment-2 > div.b3-comment-content > ul.b3-comments').children().length).toEqual(1);

              expect(this.view.$('#comment-3 > div.b3-comment-content > ul.b3-comments').children().length).toEqual(2);
              expect(this.view.$('#comment-5 > div.b3-comment-content > ul.b3-comments').children().length).toEqual(1);
            });
          });
        });

        describe("When fetching fails", function() {
          it("should display an error", function() {
            var response = '';
            this.server = sinon.fakeServer.create();
            this.server.respondWith(
              'GET',
              this.url,
              [404, {'Content-Type': 'application/json'}, JSON.stringify(response)]
            );
            this.view = new SinglePostView({model: this.post, collection: new Comments(), user: this.user});
            this.view.render();

            this.server.respond();
            expect(this.view.$('.b3-comments').text()).not.toEqual('');
          });
        });
      });
    });

    describe(".addComment", function() {
      beforeEach(function() {
        this.comment = new Comment({"ID":59,"post":1,"content":"<p>reply to the post<\/p>\n","status":"approved","type":"comment","parent":0,"author":1,"date": new Date(),"date_tz":"UTC","date_gmt": new Date(),"meta":{"links":{"up":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/16","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/b3:comments\/59"}}});
        this.spy     = spyOn(SinglePostView.prototype, 'render').andCallThrough();
        this.post    = new Post({ID: 1});
        this.view    = new SinglePostView({model: this.post, collection: new Comments(), user: this.user});
      });

      it("should add to its collection", function() {
        this.view.addComment(this.comment);
        expect(this.view.collection.length).toEqual(1);
      });

      it("should re-render the view", function() {
        this.view.addComment(this.comment);
        expect(this.spy).toHaveBeenCalled();
      });
    });

    describe(".render", function() {
      it("should render the template", function() {
        this.post = new Post({
          ID:      1,
          title:   'Title',
          content: 'Some Content'
        });
        this.view = new SinglePostView({model: this.post, collection: new Comments(), user: this.user});
        this.view.render();

        expect(this.view.el).toBeDefined();
      });
    });

    describe("Replying to the post", function() {
      it("should display a comment box", function() {
        var that = this;

        this.post = new Post({ID: 1, comment_status: 'open'});
        this.view = new SinglePostView({model: this.post, collection: new Comments(), user: this.user});
        this.view.render();

        var template = new ReplyFormView({
          parentView: that.view,
          user: that.user,
          model: that.post,
          parentId: 0
        }).render().el;

        $(template).slideDown();

        var button = this.view.$('.b3-reply-post');
        var box;

        runs(function() {
          button.click();
        });

        waitsFor(function() {
          box = $(button).next('#b3-replyform');
          return box.length > 0;
        }, "the comment form to appear.", 750);

        runs(function() {
          expect(box[0].isEqualNode(template)).toBeTruthy();
        });
      });
    });

    describe("When post content has multiple pages", function() {
      beforeEach(function() {
        this.eventbus = spyOn(EventBus, 'trigger');
        this.post = new Post({
          ID:      1,
          slug:    'slug',
          title:   'Title',
          content: 'Page 1<!--nextpage-->Page 2<!--nextpage-->Page 3'
        });
        this.view = new SinglePostView({model: this.post, collection: new Comments()});
        this.view.render();
      });

      it("should split the post into multiple pages", function() {
        expect(this.view.$('.b3-post-content').text()).toEqual('Page 1');
      });

      it("should display next page control and hide previous page control", function() {
        expect(this.view.$('.pagination .next a').length).toEqual(1);
        expect(this.view.$('.pagination .previous a').parent().attr('class')).toContain('disabled');
      });

      describe("clicking the next page link", function() {
        it("should display the next page", function() {
          this.view.$('.pagination .next a').click();
          expect(this.view.$('.b3-post-content').text()).toEqual('Page 2');
        });

        it("should trigger an event to navigate to the page", function() {
          this.view.$('.pagination .next a').click();
          expect(this.eventbus).toHaveBeenCalledWith('router:nav', {route: '/post/' + this.post.get('slug') + '/page/2', options: {trigger: false}});
        });
      });

      describe("clicking on a page number", function() {
        it("should display the requested page", function() {
          this.view.$('.pagination .number:eq(2) a').click();
          expect(this.view.$('.b3-post-content').text()).toEqual('Page 3');
        });

        it("should trigger an event to navigate to the page", function() {
          this.view.$('.pagination .number:eq(2) a').click();
          expect(this.eventbus).toHaveBeenCalledWith('router:nav', {route: '/post/' + this.post.get('slug') + '/page/3', options: {trigger: false}});
        });
      });

      describe("clicking the previous page link", function() {
        beforeEach(function() {
          this.view = new SinglePostView({model: this.post, page: 3, collection: new Comments()});
          this.view.render();
        });

        it("should display the previous page", function() {
          this.view.$('.pagination .previous a').click();
          expect(this.view.$('.b3-post-content').text()).toEqual('Page 2');
        });

        it("should trigger an event to navigate to the page", function() {
          this.view.$('.pagination .previous a').click();
          expect(this.eventbus).toHaveBeenCalledWith('router:nav', {route: '/post/' + this.post.get('slug') + '/page/2', options: {trigger: false}});
        });
      });
    });

    sharedBehaviourFor('category', {click: '.b3-post-categories > span > a', route: 'post/category/post-1'});
    sharedBehaviourFor('tag', {click: '.b3-post-tags > span > a', route: 'post/tag/tag-1'});
  });
});
