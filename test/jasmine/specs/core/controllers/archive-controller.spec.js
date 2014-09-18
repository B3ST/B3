/* global define */

define([
  'controllers/archive-controller',
  'controllers/base-controller',
  'buses/command-bus',
  'buses/event-bus',
  'buses/request-bus',
  'buses/navigator',
  'models/post-model',
  'models/settings-model',
  'models/user-model',
  'models/taxonomy-model',
  'collections/post-collection',
  'views/archive-view',
  'views/not-found-view',
  'sinon'
], function (ArchiveController, BaseController, CommandBus, EventBus, RequestBus, Navigator, Post, Settings, User, Taxonomy, Posts, ArchiveView, NotFoundView) {
  'use strict';

  describe("ArchiveController", function() {
    var app, controller, options, user, region;

    beforeEach(function() {
      var post = new Post({ID: 1, slug: 'post'});

      user    = new User({ID: 1, email: 'email', name: 'name'}),
      app     = jasmine.createSpyObj('main', ['show']);
      region  = jasmine.createSpyObj('region', ['show']);
      options = {
        region: region,
        posts:  new Posts([this.post]),
        app:    app,
        user:   user
      };
    });

    it("should inherit from BaseController", function() {
      expect(inherits(ArchiveController, BaseController)).toBeTruthy();
    });

    it("should bind to a given set of events", function() {
      controller = new ArchiveController({});
      expect(controller.busEvents).toEqual({
        'archive:show':                  'showArchive',
        'archive:view:display:category': 'showPostByCategory',
        'archive:view:display:tag':      'showPostByTag',
        'archive:view:display:author':   'showPostByAuthor',

        'pagination:previous:page':      'showPage',
        'pagination:next:page':          'showPage',
        'pagination:select:page':        'showPage',

        'search:start':                  'saveCurrentState',
        'search:stop':                   'loadPreviousState',
        'search:results:found':          'displayResults',
        'search:results:not_found':      'displayResults'
      });
    });

    it("should have a set of child controllers", function() {
      controller = new ArchiveController({});
      expect(controller.childControllers).toEqual({
        pagination: 'paginationController'
      });
    });

    describe(".showHome", function() {
      describe("When home is not a page", function() {
        it("should display the archive", function() {
          spyOn(Settings, 'get').and.callFake(function () {
            return 0;
          });
          var archive = spyOn(ArchiveController.prototype, 'showArchive');

          controller = new ArchiveController(options);
          controller.showHome();

          expect(archive).toHaveBeenCalled();
        });
      });

      describe("When home is set to a page", function() {
        it("should display that page", function() {
          spyOn(Settings, 'get').and.callFake(function () {
            return 100;
          });
          var bus = spyOn(EventBus, 'trigger');

          controller = new ArchiveController(options);
          controller.showHome();

          expect(bus).toHaveBeenCalledWith('page:show', {page: 100});
        });
      });
    });

    describe(".showArchive", function() {
      var server, bus, posts;

      beforeEach(function() {
        var response = [
          new Post({ID: 1, title: 'post-1'}).toJSON(),
          new Post({ID: 2, title: 'post-2'}).toJSON()
        ];

        server = stubServer({
          response: response,
          url:      Settings.get('api_url') + '/posts',
          code:     200
        });

        bus        = spyOn(CommandBus, 'execute');
        posts      = spyOn(Posts.prototype, 'fetch').and.callThrough();
        controller = new ArchiveController(options);

        controller.showArchive({paged: 2});
        server.respond();
      });

      it("should fetch the collection of posts of a given page", function() {
        expect(posts).toHaveBeenCalledWith({reset: true, data: $.param({ page: 2 })});
      });

      xit("should trigger a show:loading command", function() {
        expect(bus).toHaveBeenCalledWith('show:loading', { region: region, loading: true });
      });

      describe("When fetching is successful", function() {
        var show;

        beforeEach(function() {
          show = spyOn(ArchiveController.prototype, 'show');

          var response = [
            new Post({ID: 1, title: 'post-1'}).toJSON(),
            new Post({ID: 2, title: 'post-2'}).toJSON()
          ], server = stubServer({
            url:      Settings.get('api_url') + '/posts?page=2',
            code:     200,
            response: response
          });

          controller = new ArchiveController(options);

          controller.showArchive({paged: 2});
          server.respond();
        });

        it("should show the archive view", function() {
          expect(show).toHaveBeenCalledWith(jasmine.any(ArchiveView));
        });
      });
    });

    describe('.showPage', function() {
      var fetch, bus, controller;

      beforeEach(function() {
        fetch = spyOn(Posts.prototype, 'fetch').and.callThrough();
        bus   = spyOn(EventBus, 'trigger');
        spyOn(Navigator, 'getRoute').and.callFake(function () {
          return 'url/page/2';
        });

        var posts = [
          new Post({ID: 1, title: 'post-1'}).toJSON(),
          new Post({ID: 2, title: 'post-2'}).toJSON()
        ];

        controller = new ArchiveController({
          posts:  new Posts(posts),
          app:    jasmine.createSpyObj('main', ['show']),
          user:   new User({ID: 1, email: 'email', name: 'name'}),
          page:   2,
          region: jasmine.createSpyObj('region', ['show'])
        });
        controller.showPage({page: 1});
      });

      it("should request the next page", function() {
        expect(fetch).toHaveBeenCalledWith({reset: true, data: 'page=1'});
      });

      it("should navigate to page/<page_number> URL", function() {
        expect(bus).toHaveBeenCalledWith('router:nav', {route: 'url/page/1', options: {trigger: false}});
      });
    });

    xdescribe(".displayPost", function() {
      var bus, post;

      beforeEach(function() {
        bus        = spyOn(EventBus, 'trigger');
        controller = new ArchiveController(options);

        controller.displayPost({post: 1});
      });

      it("should not be displaying and save it into the state", function() {
        expect(controller.isDisplaying).toBeFalsy();
        expect(controller.state.was_displaying).toBeFalsy();
      });

      it("should trigger a post:show event", function() {
        expect(bus).toHaveBeenCalledWith('post:show', {post: this.post});
      });

      it("should navigate to the given post", function() {
        expect(bus).toHaveBeenCalledWith('router:nav', {route: 'post/post', options: { trigger: false }});
      });
    });

    xdescribe(".saveCurrentState", function() {
      it("should save the current displaying options", function() {
        var posts = new Posts();
        controller = new ArchiveController(options);

        controller.show(controller._archiveView(posts, null, jasmine.any(Object)));
        controller.saveCurrentState();

        expect(controller.state).toEqual({
          was_displaying: true,
          collection:     posts,
          page:           1,
          filter:         jasmine.any(Object)
        });
      });
    });

    xdescribe(".loadPreviousState", function() {
      beforeEach(function() {
        this.posts      = new Posts();
        this.appShow    = spyOn(app.main, 'show');
        this.controller = new ArchiveController({
          posts: this.posts,
          app:   app,
          user:  user
        });

        this.controller.state = {
          was_displaying: true,
          collection:     this.posts
        };

        this.controller.loadPreviousState();
      });

      it("should load the previous displaying options", function() {
        this.controller.posts = this.posts;
        this.controller.page  = 1;
      });

      it("should display the corresponding view", function() {
        var view = this.appShow.calls.mostRecent();
        expect(typeof view).toEqual('ArchiveView');
        expect(view.collection).toEqual(this.posts);
      });
    });

    xdescribe(".displayResults", function() {
      it("should display the given results", function() {
        this.posts      = new Posts();
        this.appShow    = spyOn(app.main, 'show');
        this.controller = new ArchiveController({
          posts: this.posts,
          app:   app,
          user:  user
        });

        this.controller.displayResults({results: this.posts, filter: null});

        var view = this.appShow.calls.mostRecent();
        expect(typeof view).toEqual('ArchiveView');
        expect(view.collection).toEqual(this.posts);
      });
    });

    xdescribe(".displayNotFound", function() {
      it("should display a not found view", function() {
        this.posts      = new Posts();
        this.appShow    = spyOn(app.main, 'show');
        this.controller = new ArchiveController({
          posts: this.posts,
          app:   app,
          user:  user
        });

        this.controller.displayResults();

        var view = this.appShow.calls.mostRecent();
        expect(typeof view).toEqual('NotFoundView');
      });
    });

    sharedBehaviourForArchiveOfType('category', {
      method:        ".showPostByCategory",
      calledWith:    "category",
      runTestMethod: function  (controller) {
        controller.showPostByCategory({category: 'category'});
      },
      request: Settings.get('api_url') + '/posts?filter[category_name]=category&page=1',
      route:   'post/category/category',
      taxonomy: true
    });

    sharedBehaviourForArchiveOfType('post_tag', {
      method:        ".showPostByTag",
      calledWith:    "tag",
      runTestMethod: function (controller) {
        controller.showPostByTag({post_tag: 'tag'});
      },
      request: Settings.get('api_url') + '/posts?filter[tag]=tag&page=1',
      route:   'post/tag/tag',
      taxonomy: true
    });

    sharedBehaviourForArchiveOfType('author', {
      method:        ".showPostByAuthor",
      runTestMethod: function  (controller) {
        controller.showPostByAuthor({author: 'author'});
      },
      request: Settings.get('api_url') + '/posts?filter[author_name]=author&page=1',
      route:   'post/author/author',
      taxonomy: false
    });

    sharedBehaviourForArchiveOfType('date', {
      method:        ".showPostByDate",
      runTestMethod: function (controller) {
        controller.showPostByDate({monthnum: '03', day: '12', year: '2014'});
      },
      request:  Settings.get('api_url') + '/posts?filter[year]=2014&filter[month]=03&filter[day]=12&page=1',
      route:    'post/2014/03/12',
      taxonomy: false
    });
  });

  function sharedBehaviourForArchiveOfType (type, options) {
    xdescribe(options.method, function() {
      var controllerOptions, request, fetch, controller, navigate;

      beforeEach(function() {
        request = spyOn(RequestBus, 'request').and.callFake(function () {
          return new Taxonomy();
        });

        navigate = spyOn(Navigator, 'navigateToTaxonomy');

        controllerOptions = {
          posts: new Posts(),
          app:   jasmine.createSpyObj('main', ['show']),
          user:  new User({ID: 1, email: 'email', name: 'name'})
        }
      });

      if (options.taxonomy) {
        it("should request the given terms if not already loaded", function() {
          controller = new ArchiveController(controllerOptions);
          options.runTestMethod(controller);

          expect(request).toHaveBeenCalledWith('taxonomy:get', {taxonomy: type, term: options.calledWith});
        });
      }

      it("should fetch the corresponding posts of a given " + type, function() {
        fetch      = spyOn(Posts.prototype, 'fetch').and.callThrough();
        controller = new ArchiveController(controllerOptions);
        options.runTestMethod(controller);

        expect(fetch).toHaveBeenCalled();
      });

      describe("When fetching posts is successful", function() {
        it("should show the archive view", function() {
          var show = spyOn(ArchiveController.prototype, 'show'),
              response = new Post({ID: 1}),
              server = stubServer({
            url: options.request,
            code: 200,
            response: [response.toJSON()]
          });

          controller = new ArchiveController(controllerOptions);
          options.runTestMethod(controller);
          server.respond();

          expect(show).toHaveBeenCalledWith(jasmine.any(ArchiveView));
        });
      });

      describe("When fetching posts fails", function() {
        it("should show a not found view", function() {
          var show = spyOn(ArchiveController.prototype, 'show'),
              server = stubServer({
            url: options.request,
            code: 404,
            response: ''
          });

          controller = new ArchiveController(controllerOptions);
          options.runTestMethod(controller);
          server.respond();

          expect(show).toHaveBeenCalledWith(jasmine.any(NotFoundView));
        });
      });

      xit("should navigate to the corresponding url", function() {
        controller = new ArchiveController(controllerOptions);
        options.runTestMethod(controller);

        expect(navigate).toHaveBeenCalledWith(type, options.calledWith, 1, false);
      });
    });
  }
});