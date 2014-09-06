define([
  'controllers/single-controller',
  'models/settings-model',
  'models/user-model',
  'models/post-model',
  'models/page-model',
  'models/comment-model',
  'collections/post-collection',
  'collections/comment-collection',
  'views/single-post-view',
  'views/not-found-view',
  'controllers/bus/event-bus',
  'controllers/bus/command-bus',
  'app',
  'sinon'
], function (SingleController, Settings, User, Post, Page, Comment, Posts, Comments, SinglePostView, NotFoundView, EventBus, CommandBus, App) {
  'use strict';

  describe("SingleController", function() {
    beforeEach(function() {
      this.app  = App;
      this.user = new User({ID: 1, email: 'email', name: 'name'});
      this.app.start();
    });

    afterEach(function() {
      this.app.main.$el.html('');
      this.app.header.$el.html('');
      this.app.footer.$el.html('');
      window.scrollTo(0, 0);
    });

    describe(".initialize", function() {
      beforeEach(function() {
        this.bus = spyOn(EventBus, 'bind');
        this.controller = new SingleController({ app: App });
      });

      it("should bind to single:display:category", function() {
        expect(this.bus).toHaveBeenCalledWith('single:display:category', this.controller.navigateToCategories);
      });

      it("should bind to single:display:tag", function() {
        expect(this.bus).toHaveBeenCalledWith('single:display:tag', this.controller.navigateToTags);
      });

      it("should bind to single:display:author", function() {
        expect(this.bus).toHaveBeenCalledWith('single:display:author', this.controller.navigateToAuthor);
      });

      it("should bind to single:display:page", function() {
        expect(this.bus).toHaveBeenCalledWith('single:display:page', this.controller.navigateToPage);
      });

      it("should bind to post:show", function() {
        expect(this.bus).toHaveBeenCalledWith('post:show', this.controller.showPost);
      });

      it("should bind to page:show", function() {
        expect(this.bus).toHaveBeenCalledWith('page:show', this.controller.showPageById);
      });

      it("should bind to comment:create", function() {
        expect(this.bus).toHaveBeenCalledWith('comment:create', this.controller.addComment);
      });

      it("should bind to search:start event", function() {
        expect(this.bus).toHaveBeenCalledWith('search:start', this.controller.saveCurrentState);
      });

      it("should bind to search:stop event", function() {
        expect(this.bus).toHaveBeenCalledWith('search:stop', this.controller.loadPreviousState);
      });
    });

    describe(".saveCurrentState", function() {
      it("should save the current displaying options", function() {
        this.controller = new SingleController({ app: App });

        this.controller.show(this.controller._singlePostView(new Post(), this.controller.collection, 1));
        this.controller.saveCurrentState();

        expect(this.controller.state).toEqual({
          was_displaying: true,
          post:           this.controller.post,
          collection:     this.controller.collection,
          page:           this.controller.page
        });
      });
    });

    describe(".loadPreviousState", function() {
      beforeEach(function() {
        this.post       = new Post();
        this.comments   = new Comments();
        this.appShow    = spyOn(App.main, 'show');
        this.controller = new SingleController({ app: App });

        this.controller.state = {
          was_displaying: true,
          post:           this.post,
          collection:     this.comments,
          page:           1
        };

        this.controller.loadPreviousState();
      });

      it("should load the previous displaying options", function() {
        this.controller.post       = this.post;
        this.controller.page       = 1;
        this.controller.collection = this.comments;
      });

      it("should display the corresponding view", function() {
        var view = this.appShow.mostRecentCall.args[0];
        expect(view instanceof SinglePostView).toBeTruthy();
        expect(view.collection).toEqual(this.comments);
        expect(view.model).toEqual(this.post);
      });
    });

    describe(".showPost", function() {
      beforeEach(function() {
        this.url  = 'http://root.org/post/1/comments';
        this.post = new Post({
          ID:      1,
          title:   'Title',
          content: 'Some Content',
          slug:    'post-slug-1',
          meta: {
            links: {
              replies: this.url
            }
          }
        });
      });

      it("should trigger a loading:show command", function() {
        this.cBus = spyOn(CommandBus, 'execute');

        this.controller = new SingleController({ app: App });
        this.controller.showPost({post: this.post });

        expect(this.cBus).toHaveBeenCalledWith('loading:show', {region: jasmine.any(Backbone.Marionette.Region)});
      });

      it("should display the corresponding view", function() {
        this.appShow = spyOn(App.main, 'show');

        this.controller = new SingleController({ app: App });
        this.controller.showPost({post: this.post });

        var view = this.appShow.mostRecentCall.args[0];
        expect(view instanceof SinglePostView).toBeTruthy();
      });

      it("should fetch the corresponding post comments", function() {
        this.spy  = spyOn(Post.prototype, 'fetchComments').andCallThrough();

        this.controller = new SingleController({ app: App });
        this.controller.showPost({post: this.post });

        expect(this.spy).toHaveBeenCalled();
      });
    });

    sharedNavigationBehaviourFor('.navigateToCategories', {
      route:        'post/category/slug',
      runTestMethod: function (controller) {
        controller.navigateToCategories({slug: 'slug'});
      }
    });

    sharedNavigationBehaviourFor('.navigateToTags', {
      route:        'post/tag/slug',
      runTestMethod: function (controller) {
        controller.navigateToTags({slug: 'slug'});
      }
    });

    sharedNavigationBehaviourFor('.navigateToAuthor', {
      route:        'post/author/slug',
      runTestMethod: function (controller) {
        controller.navigateToAuthor({slug: 'slug'});
      }
    });

    sharedPostBehaviourFor(".showPostById", {
      request:       Settings.get('api_url') + '/posts/1',
      runTestMethod: function (controller) {
        controller.showPostById({id: 1});
      }
    });

    sharedPostBehaviourFor(".showPostBySlug", {
      request:       Settings.get('api_url') + '/posts/b3:slug:post-slug-1',
      runTestMethod: function  (controller) {
        controller.showPostBySlug({post: 'post-slug-1'});
      }
    });

    sharedPageBehaviourFor(".showPageBySlug", {
      request:       Settings.get('api_url') + '/pages/page-slug',
      runTestMethod: function (controller) {
        controller.showPageBySlug({page: 'page-slug'});
      }
    });

    sharedPageBehaviourFor(".showPageById", {
      request:       Settings.get('api_url') + '/pages/1',
      runTestMethod: function (controller) {
        controller.showPageById({page: 1});
      }
    })
  });

  function sharedNavigationBehaviourFor (method, options) {
    describe(method, function() {
      it("should navigate to categories", function() {
        this.bus = spyOn(EventBus, 'trigger');
        this.controller = new SingleController({ app: App });
        options.runTestMethod(this.controller);
        expect(this.bus).toHaveBeenCalledWith('router:nav', {route: options.route, options: {trigger: true}});
      });
    });
  }

  function sharedPageBehaviourFor (method, options) {
    describe(method, function() {
      it("should fetch the selected page", function() {
        this.fetch      = spyOn(Page.prototype, 'fetch').andCallThrough();
        this.controller = new SingleController({ app: App });

        options.runTestMethod(this.controller);
        expect(this.fetch).toHaveBeenCalled();
      });

      describe("When fetching is successful", function() {
        beforeEach(function() {
          this.response = new Page({ID: 1, title: 'title', meta: { links: {replies: this.url }}});
          this.server   = stubServer({
            response: this.response.toJSON(),
            url:      options.request,
            code:     200
          });
        });

        it("should trigger show:archive event if the page is supposed to display posts", function() {
          spyOn(Settings, 'get').andCallFake(function () {
            return 1;
          });
          this.bus = spyOn(EventBus, 'trigger');
          this.controller = new SingleController({ app: App });

          options.runTestMethod(this.controller);
          this.server.respond();

          expect(this.bus).toHaveBeenCalledWith('archive:show', {paged: 1});
        });

        it("should display the corresponding view", function() {
          this.url        = 'http://root.org/page/1/comments';
          this.appShow    = spyOn(this.app.main, 'show');
          this.controller = new SingleController({ app: App });

          options.runTestMethod(this.controller);
          this.server.respond();

          var view = this.appShow.mostRecentCall.args[0];
          expect(view instanceof SinglePostView).toBeTruthy();
        });

        it("should fetch the comments of the returned post", function() {
          this.url      = 'http://root.org/page/1/comments';
          this.fetch    = spyOn(SingleController.prototype, '_loadComments').andCallThrough();
          this.response = new Page({ID: 1, title: 'title', meta: { links: {replies: this.url }}});
          this.server   = stubServer({
            response: this.response.toJSON(),
            url:      options.request,
            code:     200
          });

          this.controller = new SingleController({ app: App });

          options.runTestMethod(this.controller);
          this.server.respond();

          expect(this.fetch).toHaveBeenCalled();
        });
      });

      describe("When fetching fails", function() {
        beforeEach(function() {
          this.appShow = spyOn(this.app.main, 'show');
          this.server = stubServer({
            response: '',
            url:      options.request,
            code:     404
          });

          this.controller = new SingleController({ app: App });
          options.runTestMethod(this.controller);
          this.server.respond();
        });

        it("should display a not found view", function() {
          var view = this.appShow.mostRecentCall.args[0];
          expect(view instanceof NotFoundView).toBeTruthy();
        });
      });
    });
  }

  function sharedPostBehaviourFor (method, options) {
    describe(method, function() {
      beforeEach(function() {
        this.url  = 'http://root.org/post/1/comments';
        this.post = new Post({
          ID:      1,
          title:   'Title',
          content: 'Some Content',
          slug:    'post-slug-1',
          meta: {
            links: {
              replies: this.url
            }
          }
        });

        this.appShow = spyOn(this.app.main, 'show');
      });

     it("should fetch the selected post", function() {
        this.fetch      = spyOn(Post.prototype, 'fetch').andCallThrough();
        this.controller = new SingleController({
          app: App,
        });

        options.runTestMethod(this.controller);
        expect(this.fetch).toHaveBeenCalled();
      });

      describe("When fetching is successful", function() {
        beforeEach(function() {
          this.fetch    = spyOn(SingleController.prototype, '_loadComments').andCallThrough();
          this.response = this.post;
          this.server   = stubServer({
            response: this.response.toJSON(),
            url:      options.request,
            code:     200
          });

          this.controller = new SingleController({
            posts: new Posts(),
            app:   App,
            user:  this.user
          });

          options.runTestMethod(this.controller);
          this.server.respond();
        });

        it("should display the corresponding view", function() {
          var view = this.appShow.mostRecentCall.args[0];
          expect(view instanceof SinglePostView).toBeTruthy();
        });

        it("should fetch the comments of the returned post", function() {
          expect(this.fetch).toHaveBeenCalled();
        });
      });

      describe("When fetching fails", function() {
        beforeEach(function() {
          this.server = stubServer({
            response: '',
            url:      options.request,
            code:     404
          });

          this.controller = new SingleController({
            posts: new Posts(),
            app:   App,
            user:  this.user
          });
          options.runTestMethod(this.controller);
          this.server.respond();
        });

        it("should display a not found view", function() {
          var view = this.appShow.mostRecentCall.args[0];
          expect(view instanceof NotFoundView).toBeTruthy();
        });
      });
    });
  }

  function stubServer (options) {
    var server = sinon.fakeServer.create();
    server.respondWith(
      'GET',
      options.url,
      [options.code, {'Content-Type': 'application/json'}, JSON.stringify(options.response)]
    );

    return server;
  }
});