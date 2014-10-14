/* global define */

define([
  'buses/navigator',
  'buses/event-bus',
  'models/settings-model',
  'models/post-model'
], function (Navigator, EventBus, Settings, Post) {
  'use strict';

  var bus;

  describe("Navigator", function() {
    beforeEach(function() {
      var routes = getJSONFixture('route.json');
      Settings.set('routes', routes);
      bus = spyOn(EventBus, 'trigger');
    });

    describe(".initialize", function() {
      it("should set the default routes", function() {
        Navigator.initialize();

        expect(Navigator.routes.root[0]).toEqual('(/page/{paged})');
        expect(Navigator.routes.page[0]).toEqual('{page}(/page/{paged})');
        expect(Navigator.routes.post[0]).toEqual('post/{post}(/page/{paged})');
        expect(Navigator.routes.date).toEqual([
          'post/{year}(/page/{paged})',
          'post/{year}/{monthnum}(/page/{paged})',
          'post/{year}/{monthnum}/{day}(/page/{paged})'
        ]);
        expect(Navigator.routes.author[0]).toEqual('post/author/{author}(/page/{paged})');
        expect(Navigator.routes.category[0]).toEqual('post/category/{category}(/page/{paged})');
        expect(Navigator.routes.post_tag[0]).toEqual('post/tag/{post_tag}(/page/{paged})');
        expect(Navigator.routes.post_format[0]).toEqual('post/type/{post_format}(/page/{paged})');
        expect(Navigator.routes.search[0]).toEqual('search/{search}(/page/{paged})');
      });
    });

    describe(".navigate", function() {
      it("should trigger an event of router:nav", function() {
        Navigator.navigate('route', false);
        expect(bus).toHaveBeenCalledWith('router:nav', {route: 'route', options: {trigger: false}});
      });
    });

    describe(".getRouteOfType", function() {
      it("should return the route of the corresponding type", function() {
        var route = Navigator.getRouteOfType('post', 'slug');
        expect(route).toEqual('post/slug');
      });

      describe("When page is specified", function() {
        it("should return the route with corresponding page", function() {
          var route = Navigator.getRouteOfType('post', 'slug', 2);
          expect(route).toEqual('post/slug/page/2');
        });
      });
    });

    sharedNavigationBehaviour(".navigateToHome", {
      type:         '',
      url:          '',
      methodToTest: function (content, page) {
        Navigator.navigateToHome(content, page, false);
      }
    });

    sharedNavigationBehaviour(".navigateToPost", {
      type:         'post',
      url:          'post/',
      methodToTest: function (content, page) {
        Navigator.navigateToPost(new Post({ slug: 'post', date: new Date(2013, 7, 21, 13, 19, 20, 21) }), page, false);
      }
    });

    sharedNavigationBehaviour(".navigateToPage", {
      type:         'page',
      url:          '',
      methodToTest: function (content, page) {
        Navigator.navigateToPage(content, page, false);
      }
    });

    sharedNavigationBehaviour(".navigateToAuthor", {
      type:         'author',
      url:          'post/author/',
      methodToTest: function (content, page) {
        Navigator.navigateToAuthor(content, page, false);
      }
    });

    sharedNavigationBehaviour(".navigateToTaxonomy", {
      type:         'author',
      url:          'post/category/',
      methodToTest: function (content, page) {
        Navigator.navigateToTaxonomy('category', content, page, false);
      }
    });

    sharedNavigationBehaviour(".navigateToSearch", {
      type:         'search',
      url:          'search/',
      methodToTest: function (content, page) {
        Navigator.navigateToSearch(content, page, false);
      }
    });

    sharedNavigationBehaviour(".navigateToDate", {
      type:         '',
      url:          'post/2014/03',
      methodToTest: function (content, page) {
        Navigator.navigateToDate({year: '2014', monthnum: '03'}, page, false);
      }
    });
  });

  function sharedNavigationBehaviour (navigator, options) {
    describe(navigator, function() {
      it("should trigger an event of router:nav to a " + options.type + " route", function() {
        options.methodToTest(options.type, null);
        expect(bus).toHaveBeenCalledWith('router:nav', {route: options.url +  options.type, options: {trigger: false}});
      });

      describe("When specifying a page", function() {
        it("should trigger an event of router:nav to a " + options.type + " route", function() {
          options.methodToTest(options.type, 2);
          expect(bus).toHaveBeenCalledWith('router:nav', {route: options.url + options.type + '/page/2', options: {trigger: false}});
        });
      });
    });
  }
});
