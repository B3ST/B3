/* global define */

define([
  'backbone',
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
], function (Backbone, ArchiveController, BaseController, CommandBus, EventBus, RequestBus, Navigator, Post, Settings, User, Taxonomy, Posts, ArchiveView, NotFoundView) {
  'use strict';

  describe("ArchiveController", function() {
    var app, controller, options, user, region;

    beforeEach(function() {
      var post = new Post({ID: 1, slug: 'post'});
      user    = new User({ID: 1, email: 'email', name: 'name'}),
      region  = jasmine.createSpyObj('region', ['show']);
      options = { region: region };
    });

    it("should inherit from BaseController", function() {
      expect(inherits(ArchiveController, BaseController)).toBeTruthy();
    });

    it("should bind to a given set of events", function() {
      controller = new ArchiveController({});
      expect(controller.busEvents).toEqual({
        'archive:show':                  'showArchive',

        'archive:view:display:post':     'showPost',
        'archive:view:display:category': 'showPostsByTaxonomy',
        'archive:view:display:tag':      'showPostsByTaxonomy',
        'archive:view:display:author':   'showPostsByType',

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

    describe(".showArchive", function() {
      var server, bus, posts, show;

      beforeEach(function() {
        show = spyOn(ArchiveController.prototype, 'show');
        controller = new ArchiveController(options);
      });

      it("should request all posts", function() {
        controller.showArchive();
        expect(show).toHaveBeenCalledWith(jasmine.any(ArchiveView), { loading: { done: jasmine.any(Function), fail: jasmine.any(Function) }});
      });

      describe("When fetching is successful", function() {
        var showView;
        beforeEach(function() {
          showView = spyOn(ArchiveController.prototype, 'showView');
          show.and.callFake(function (view, options) {
            var jqXHR = jasmine.createSpyObj('jqXHR', ['getResponseHeader']);
            jqXHR.getResponseHeader.and.callFake(function () {
              return "10";
            });
            options.loading.done([], "", jqXHR);
          });

          controller = new ArchiveController(options);
          controller.showArchive();
        });

        it("should show the archive view", function() {
          expect(showView).toHaveBeenCalledWith(10);
        });
      });
    });

    describe(".showPage", function() {
      var show;

      beforeEach(function() {
        show = spyOn(ArchiveController.prototype, "show");
        controller = new ArchiveController(options);
      });

      it("should request all posts", function() {
        controller.showPage({ page: 2 });
        expect(show).toHaveBeenCalledWith(null, {
          loading: {
            style: "opacity",
            entities: [controller.posts],
            done: jasmine.any(Function),
            fail: jasmine.any(Function)
          }
        });
      });

      describe("When fetching is successful", function() {
        it("should navigate to the second page", function() {
          var navigate = spyOn(Navigator, 'navigate');
          Backbone.history.fragment = '/wordpress/page/1';
          show.and.callFake(function (view, options) {
            options.loading.done();
          });

          controller.showPage({ page: 2 });
          expect(navigate).toHaveBeenCalledWith('/wordpress/page/2', false);
        });
      });
    });

    using('Taxonomy types', ['category', 'post_tag', 'author'], function (type) {
      describe(".showPostsByTaxonomy", function() {
        it("should navigate to the category taxonomy", function() {
          var navigate = spyOn(Navigator, 'navigateToTaxonomy');
          controller = new ArchiveController(options);

          controller.showPostsByTaxonomy({ slug: 'slug', type: type });
          expect(navigate).toHaveBeenCalledWith(type, 'slug', 1, true);
        });
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