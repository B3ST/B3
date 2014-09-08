/* global define, sinon, describe, beforeEach, expect, it, spyOn */

define([
  'jquery',
  'views/single-post-view',
  'buses/event-bus',
  'views/reply-form-view',
  'models/user-model',
  'models/post-model',
  'models/comment-model',
  'collections/comment-collection',
  'sinon'
], function ($, SinglePostView, EventBus, ReplyFormView, User, Post, Comment, Comments) {
  'use strict';

  describe("SinglePostView", function() {
    beforeEach(function() {
      this.user = new User();
    });

    describe(".initialize", function() {
      beforeEach(function() {
        this.bus = spyOn(EventBus, 'trigger');
        this.post = new Post({ID: 1, title: 'Title'});
        this.view = new SinglePostView({model: this.post, user: this.user});
      });

      it("should set the document title", function () {
        expect(this.bus).toHaveBeenCalledWith('title:change', 'Title');
      });
    });

    describe(".render", function() {
      beforeEach(function() {
        this.post = new Post({
          ID:      1,
          title:   'Title',
          content: 'Some Content'
        });
      });

      it("should render the template", function() {
        this.view = new SinglePostView({model: this.post, collection: new Comments(), user: this.user});
        this.view.render();

        expect(this.view.el).toBeDefined();
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

          this.view = new SinglePostView({
            model:      this.post,
            collection: new Comments(comments),
            user:       this.user
          });
          this.view.render();

          expect(this.view.$('.b3-comments').children().length).toEqual(8);
          expect(this.view.$('.b3-comment-content').length).toEqual(8);

          expect(this.view.$('#comment-1 > div.b3-comment-content > ul.b3-comments').children().length).toEqual(2);
          expect(this.view.$('#comment-2 > div.b3-comment-content > ul.b3-comments').children().length).toEqual(1);

          expect(this.view.$('#comment-3 > div.b3-comment-content > ul.b3-comments').children().length).toEqual(2);
          expect(this.view.$('#comment-5 > div.b3-comment-content > ul.b3-comments').children().length).toEqual(1);
        });
      });
    });

    describe("Replying to the post", function() {
      it("should display a comment box", function() {
        this.post = new Post({ID: 1, comment_status: 'open'});
        this.view = new SinglePostView({model: this.post, collection: new Comments(), user: this.user});
        this.view.render();

        $.fx.off;

        var template = new ReplyFormView({
          parentView: this.view,
          user:       this.user,
          model:      this.post,
          parentId:   0
        }).render().el;

        $(template).slideDown();

        var button = this.view.$('.b3-reply-post');
        var box;

        button.click();

        box = $(button).next('#b3-replyform');
        expect(box.length).toEqual(1);
        expect(box[0].isEqualNode(template)).toBeTruthy();
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
          expect(this.eventbus).toHaveBeenCalledWith('single:display:page', {page: 2});
        });
      });

      describe("clicking on a page number", function() {
        it("should display the requested page", function() {
          this.view.$('.pagination .number:eq(2) a').click();
          expect(this.view.$('.b3-post-content').text()).toEqual('Page 3');
        });

        it("should trigger an event to navigate to the page", function() {
          this.view.$('.pagination .number:eq(2) a').click();
          expect(this.eventbus).toHaveBeenCalledWith('single:display:page', {page: 3});
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
          expect(this.eventbus).toHaveBeenCalledWith('single:display:page', {page: 2});
        });
      });
    });

    sharedBehaviourFor('category', {
      click: '.b3-post-categories > span > a',
      route: 'post/category/post-1'
    });

    sharedBehaviourFor('tag', {
      click: '.b3-post-tags > span > a',
      route: 'post/tag/tag-1'
    });

    sharedBehaviourFor('author', {
      click: '.b3-post-author > span > a',
      route: 'post/author/author-1'
    });

    sharedBehaviourFor('author', {
      click: '#b3-post-author > a',
      route: 'post/author/author-1'
    })
  });

  function sharedBehaviourFor (action, options) {
    describe("When clicking in " + action, function() {
      it("should trigger a single:display:" + action, function() {
        this.spy = spyOn(EventBus, 'trigger');
        this.post = new Post({ID: 1, title: 'Title', author: new User({ID: 1, slug: 'author-1', name: 'author-name'}), terms: {category: {ID: 1, slug: 'post-1', link: "http://localhost:8888/wordpress/post/category/content"}, post_tag: {ID: 1, slug: 'tag-1', link: "http://localhost:8888/wordpress/post/tag/content"}}});
        this.view = new SinglePostView({model: this.post, user: this.user});
        this.view.render();

        var button = this.view.$(options.click);
        button.click();
        expect(this.spy).toHaveBeenCalledWith('single:display:' + action, {slug: button.attr('slug')});
      });
    });
  }
});
