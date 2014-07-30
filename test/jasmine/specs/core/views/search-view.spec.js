/* global define */

define([
  'jquery',
  'views/search-view',
  'controllers/event-bus',
  'controllers/navigator'
], function ($, SearchView, EventBus, Navigator) {
  'use strict';

  describe("SearchView", function() {
    beforeEach(function() {
      spyOn(Navigator, 'getRoute').andCallFake(function () {
        return 'some/url';
      });
      this.view = new SearchView({});
      this.view.render();
    });

    describe("When typing in search box", function() {
      beforeEach(function() {
        this.bus = spyOn(EventBus, 'trigger');
      });

      describe("When term is less than 3 characters", function() {
        it("should trigger an event of search:start", function() {
          this.view.$('input#search-site').val('ter');
          this.view.$('input#search-site').keyup();
          expect(this.bus).toHaveBeenCalledWith('search:start');
        });

        it("should save the previous route", function() {
          this.view.$('input#search-site').val('ter');
          this.view.$('input#search-site').keyup();
          expect(this.view.previousRoute).toEqual('some/url');
        });

        it("should trigger an event of search:end when term is empty", function() {
          this.view.$('input#search-site').val('');
          this.view.$('input#search-site').keyup();
          expect(this.bus).toHaveBeenCalledWith('search:end');
        });

        it("should trigger a navigation to the previous url when term is empty", function() {
          this.view.previousRoute = 'some/url';
          this.view.$('input#search-site').val('');
          this.view.$('input#search-site').keyup();
          expect(this.bus).toHaveBeenCalledWith('router:nav', {route: 'some/url', options: {trigger: false}});
        });
      });

      describe("When term is more than 3 characters", function() {
        it("should trigger an event of search:term", function() {
          this.view.$('input#search-site').val('term');
          this.view.$('input#search-site').keyup();
          expect(this.bus).toHaveBeenCalledWith('search:term', {s: 'term'});
        });

        it("should trigger a navigation with the query term when enter key is pressed", function() {
          var e = jQuery.Event("keyup");
          e.which = 13;
          e.keyCode = 13;

          this.view.$('input#search-site').val('term');
          this.view.$('input#search-site').keyup();
          this.view.$("input#search-site").trigger(e);
          expect(this.bus).toHaveBeenCalledWith('router:nav', {route: 'post?s=term', options: {trigger: false}});
        });
      });
    });
  });
});