/* global define */

define([
  'app',
  'controllers/search-controller',
  'controllers/bus/event-bus',
  'controllers/bus/command-bus',
  'models/settings-model',
  'models/post-model',
  'models/user-model',
  'collections/post-collection',
  'views/archive-view',
  'views/not-found-view',
  'sinon'
], function (App, SearchController, EventBus, CommandBus, Settings, Post, User, Posts, ArchiveView, NotFoundView) {
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
      this.user = new User({ID: 1, email: 'email', name: 'name'});
    });

    describe(".initialize", function() {
      beforeEach(function() {
        this.bus = spyOn(EventBus, 'bind');
        this.controller = new SearchController({ app: App });
      });

      it("should bind to search:view:start event", function() {
        expect(this.bus).toHaveBeenCalledWith('search:view:start', this.controller.searchStart);
      });

      it("should bind to search:view:term event", function() {
        expect(this.bus).toHaveBeenCalledWith('search:view:term', this.controller.showSearchResults);
      });

      it("should bind to search:view:submit event", function() {
        expect(this.bus).toHaveBeenCalledWith('search:view:submit', this.controller.displaySearchUrl);
      });

      it("should bind to search:view:stop event", function() {
        expect(this.bus).toHaveBeenCalledWith('search:view:stop', this.controller.searchStop);
      });
    });

    describe(".searchStart", function() {
      beforeEach(function() {
        this.bus        = spyOn(EventBus, 'trigger');
        this.command    = spyOn(CommandBus, 'execute');
        this.controller = new SearchController({ app: App });
        this.controller.searchStart();
      });

      it("should trigger an event of search:start", function() {
        expect(this.bus).toHaveBeenCalledWith('search:start');
      });

      it("should trigger a command to display loading", function() {
        expect(this.command).toHaveBeenCalledWith('loading:show', {region: App.main});
      });
    });

    describe(".showSearchResults", function() {
      it("should query with the given term", function() {
        this.fetch      = spyOn(Posts.prototype, 'fetch').andCallThrough();
        this.controller = new SearchController({ app: App });

        this.controller.showSearchResults({s: 'term'});
        expect(this.fetch).toHaveBeenCalledWith({reset: true, data: 'filter[s]=term&page=1'});
      });

      describe("When fetching is successful", function() {
        it("should trigger a search:results event with the obtained results", function() {
          this.bus = spyOn(EventBus, 'trigger');
          var response = [
            new Post({ID: 1, title: 'post-1'}).toJSON(),
            new Post({ID: 2, title: 'post-2'}).toJSON()
          ];
          this.server = stubServer({
            response: response,
            url:      Settings.get('apiUrl') + '/posts?filter[s]=term&page=1',
            code:     200
          });
          this.controller = new SearchController({ app: App });

          this.controller.showSearchResults({s: 'term'});
          this.server.respond();

          expect(this.bus).toHaveBeenCalledWith('search:results:found', {results: jasmine.any(Posts), filter: jasmine.any(Object)});
        });
      });

      describe("When fetching fails", function() {
        it("should display a not found view", function() {
          this.bus = spyOn(EventBus, 'trigger');
          this.server = stubServer({
            response: '',
            url:      Settings.get('apiUrl') + '/posts?filter[s]=term&page=1',
            code:     404
          });

          this.controller = new SearchController({ app: App });

          this.controller.showSearchResults({s: 'term'});
          this.server.respond();

          expect(this.bus).toHaveBeenCalledWith('search:results:not_found');
        });
      });
    });

    describe(".showSearch", function() {
      it("should display the results of the given query", function() {
        this.spy = spyOn(SearchController.prototype, 'showSearchResults');
        this.controller = new SearchController({ app: App });

        this.controller.showSearch({search: 'term', paged: 2});
        expect(this.spy).toHaveBeenCalledWith({s: 'term', page: 2});
      });
    });

    describe(".displaySearchUrl", function() {
      it("should trigger a router:nav event to the corresponding url", function() {
        this.bus        = spyOn(EventBus, 'trigger');
        this.controller = new SearchController({ app: App });

        this.controller.displaySearchUrl({s: 'result'});
        EventBus.trigger('router:nav', {route: 'search/result', options: { trigger: false }});
      });
    });

    describe(".searchStop", function() {
      it("should display the view prior to the search", function() {
        this.bus        = spyOn(EventBus, 'trigger');
        this.controller = new SearchController({ app: App });

        this.controller.searchStop();
        expect(this.bus).toHaveBeenCalledWith('search:stop');
      });
    });
  });
});