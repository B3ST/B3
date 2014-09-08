/* global define */

define([
  'controllers/navigation/navigator',
  'buses/event-bus',
  'models/settings-model'
], function (Navigator, EventBus, Settings) {
  'use strict';

  describe("Navigator", function() {
    beforeEach(function() {
      Settings.set('routes', routes);
      this.bus = spyOn(EventBus, 'trigger');
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
        expect(this.bus).toHaveBeenCalledWith('router:nav', {route: 'route', options: {trigger: false}});
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
        Navigator.navigateToPost(content, page, false);
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

  var routes = {
    "(/page/:paged)":{
      "object":"archive",
      "type":"root",
      "tokens":[
        "paged"
      ]
    },
    ":page(/page/:paged)":{
      "object":"post",
      "type":"page",
      "tokens":[
        "page",
        "paged"
      ]
    },
    ":page/attachment/:attachment":{
      "object":"post",
      "type":"attachment",
      "tokens":[
        "page",
        "attachment"
      ]
    },
    ":page/attachment/:attachment/comments(/page/:paged)":{
      "object":"comments",
      "type":"attachment",
      "tokens":[
        "page",
        "attachment",
        "paged"
      ]
    },
    ":page/comments(/page/:paged)":{
      "object":"comments",
      "type":"page",
      "tokens":[
        "page",
        "paged"
      ]
    },
    "attachment/:attachment":{
      "object":"post",
      "type":"attachment",
      "tokens":[
        "attachment"
      ]
    },
    "post/:post(/page/:paged)":{
      "object":"post",
      "type":"post",
      "tokens":[
        "post",
        "paged"
      ]
    },
    "post/:post/attachment/:attachment":{
      "object":"post",
      "type":"attachment",
      "tokens":[
        "post",
        "attachment"
      ]
    },
    "post/:post/attachment/:attachment/comments(/page/:paged)":{
      "object":"comments",
      "type":"attachment",
      "tokens":[
        "post",
        "attachment",
        "paged"
      ]
    },
    "post/:post/comments(/page/:paged)":{
      "object":"comments",
      "type":"post",
      "tokens":[
        "post",
        "paged"
      ]
    },
    "post/:year(/page/:paged)":{
      "object":"archive",
      "type":"date",
      "tokens":[
        "year",
        "paged"
      ]
    },
    "post/:year/:monthnum(/page/:paged)":{
      "object":"archive",
      "type":"date",
      "tokens":[
        "year",
        "monthnum",
        "paged"
      ]
    },
    "post/:year/:monthnum/:day(/page/:paged)":{
      "object":"archive",
      "type":"date",
      "tokens":[
        "year",
        "monthnum",
        "day",
        "paged"
      ]
    },
    "post/author/:author(/page/:paged)":{
      "object":"author",
      "type":"author",
      "tokens":[
        "author",
        "paged"
      ]
    },
    "post/category/:category(/page/:paged)":{
      "object":"taxonomy",
      "type":"category",
      "tokens":[
        "category",
        "paged"
      ]
    },
    "post/tag/:post_tag(/page/:paged)":{
      "object":"taxonomy",
      "type":"post_tag",
      "tokens":[
        "post_tag",
        "paged"
      ]
    },
    "post/type/:post_format(/page/:paged)":{
      "object":"taxonomy",
      "type":"post_format",
      "tokens":[
        "post_format",
        "paged"
      ]
    },
    "search/:search(/page/:paged)":{
      "object":"archive",
      "type":"search",
      "tokens":[
        "search",
        "paged"
      ]
    }
  };

  function sharedNavigationBehaviour (navigator, options) {
    describe(navigator, function() {
      it("should trigger an event of router:nav to a " + options.type + " route", function() {
        options.methodToTest(options.type, null);
        expect(this.bus).toHaveBeenCalledWith('router:nav', {route: options.url +  options.type, options: {trigger: false}});
      });

      describe("When specifying a page", function() {
        it("should trigger an event of router:nav to a " + options.type + " route", function() {
          options.methodToTest(options.type, 2);
          expect(this.bus).toHaveBeenCalledWith('router:nav', {route: options.url + options.type + '/page/2', options: {trigger: false}});
        });
      });
    });
  }
});
