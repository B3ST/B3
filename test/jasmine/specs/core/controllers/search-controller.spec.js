/* global define */

define([
  'app',
  'controllers/search-controller',
  'controllers/bus/event-bus',
  'models/settings-model',
  'models/post-model',
  'models/user-model',
  'collections/post-collection',
  'views/empty-view',
  'views/archive-view',
  'views/not-found-view',
  'sinon'
], function (App, SearchController, EventBus, Settings, Post, User, Posts, EmptyView, ArchiveView, NotFoundView) {
  'use strict';

  function stubServer (options) {
    var server = sinon.fakeServer.create();
    server.respondWith(
      'GET',
      options.url,
      [options.code, {'Content-Type': 'application/json'}, JSON.stringify(options.response)]
    );

    return server;
  }

  describe("SearchController", function() {
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
        this.controller = new SearchController({});
      });

      it("should bind to search:start event", function() {
        expect(this.bus).toHaveBeenCalledWith('search:start', this.controller.showEmptySearchView);
      });

      it("should bind to search:term event", function() {
        expect(this.bus).toHaveBeenCalledWith('search:term', this.controller.showSearchResults);
      });

      it("should bind to search:end event", function() {
        expect(this.bus).toHaveBeenCalledWith('search:end', this.controller.showPreviousView);
      });
    });

    describe(".showEmptySearchView", function() {
      beforeEach(function() {
        this.spy        = spyOn(this.app.main, 'show');
        this.controller = new SearchController({
          posts: new Posts(),
          app:   this.app,
          user:  this.user
        });

        this.controller.show(this.controller.archiveView(new Posts(), 1, null));
      });

      it("should display a blank empty view", function() {
        this.controller.showEmptySearchView();

        var view = this.spy.mostRecentCall.args[0];
        expect(view instanceof EmptyView).toBeTruthy();
      });

      it("should save the previous view", function() {
        this.controller.showEmptySearchView();
        expect(this.controller.previousView).toBeDefined();
      });
    });

    describe(".showSearchResults", function() {
      it("should query with the given term", function() {
        this.fetch      = spyOn(Posts.prototype, 'fetch').andCallThrough();
        this.controller = new SearchController({
          posts: new Posts(),
          app:   this.app,
          user:  this.user
        });

        this.controller.showSearchResults({s: 'term'});
        expect(this.fetch).toHaveBeenCalledWith({reset: true, data: 'filter[s]=term&page=1'});
      });

      describe("When fetching is successful", function() {
        it("should display the given results", function() {
          this.spy = spyOn(this.app.main, 'show');
          var response = [
            new Post({ID: 1, title: 'post-1'}).toJSON(),
            new Post({ID: 2, title: 'post-2'}).toJSON()
          ];
          this.server = stubServer({
            response: response,
            url:      Settings.get('apiUrl') + '/posts?filter[s]=term&page=1',
            code:     200
          });
          this.controller = new SearchController({
            posts: new Posts(),
            app:   this.app,
            user:  this.user
          });

          this.controller.showSearchResults({s: 'term'});
          this.server.respond();

          var view = this.spy.mostRecentCall.args[0];
          expect(view instanceof ArchiveView).toBeTruthy();
        });
      });

      describe("When fetching fails", function() {
        it("should display a not found view", function() {
          this.spy = spyOn(this.app.main, 'show');
          this.server = stubServer({
            response: '',
            url:      Settings.get('apiUrl') + '/posts?filter[s]=term&page=1',
            code:     404
          });

          this.controller = new SearchController({
            posts: new Posts(),
            app:   this.app,
            user:  this.user
          });

          this.controller.showSearchResults({s: 'term'});
          this.server.respond();

          var view = this.spy.mostRecentCall.args[0];
          expect(view instanceof NotFoundView).toBeTruthy();
        });
      });
    });

    describe(".showSearch", function() {
      it("should display the results of the given query", function() {
        this.spy = spyOn(SearchController.prototype, 'showSearchResults');
        this.controller = new SearchController({
          posts: new Posts(),
          app:   this.app,
          user:  this.user
        });

        this.controller.showSearch('s=term&page=2');
        expect(this.spy).toHaveBeenCalledWith({s: 'term', page: 2});
      });
    });

    describe(".showPreviousView", function() {
      it("should display the view prior to the search", function() {
        this.spy        = spyOn(this.app.main, 'show');
        this.controller = new SearchController({
          posts: new Posts(),
          app:   this.app,
          user:  this.user
        });

        this.controller.show(this.controller.archiveView(new Posts(), 1, null));
        this.controller.showEmptySearchView();
        this.controller.showPreviousView();

        var view = this.spy.mostRecentCall.args[0];
        expect(view).toBeDefined();
        expect(view).not.toBeNull();
      });
    });
  });
});