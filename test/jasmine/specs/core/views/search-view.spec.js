/* global define */

define([
  'jquery',
  'views/search-view',
  'controllers/bus/event-bus',
  'controllers/navigation/navigator'
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

    describe("When searching, ", function() {
      beforeEach(function() {
        this.bus = spyOn(EventBus, 'trigger');
      });

      describe("starting to type any term", function () {

        it("should trigger an event of search:start", function() {
          this.view.$('input#search-site').val('t');
          this.view.$('input#search-site').keyup();
          expect(this.bus).toHaveBeenCalledWith('search:start');
        });

        it("should save the previous route", function() {
          this.view.$('input#search-site').val('t');
          this.view.$('input#search-site').keyup();
          expect(this.view.previousRoute).toEqual('some/url');
        });

        it("should save the previously typed term", function() {
          this.view.$('input#search-site').val('b');
          this.view.$('input#search-site').keyup();
          this.view.$('input#search-site').val('a');
          expect(this.view.previousSearch).toEqual('b');
        });

      });

      describe("pasting a term", function () {

        it("should trigger an event of search:start", function() {
          this.view.$('input#search-site').val('pasted term');
          this.view.$('input#search-site').keyup();
          expect(this.bus).toHaveBeenCalledWith('search:start');
        });

        it("should save the previous route", function() {
          this.view.$('input#search-site').val('pasted term');
          this.view.$('input#search-site').keyup();
          expect(this.view.previousRoute).toEqual('some/url');
        });

        it("should save the previously typed term", function() {
          this.view.$('input#search-site').val('before');
          this.view.$('input#search-site').keyup();
          this.view.$('input#search-site').val('after');
          expect(this.view.previousSearch).toEqual('before');
        });

      });

      describe("deleting all terms", function() {

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

        it("should save the previously typed term", function() {
          this.view.$('input#search-site').val('before');
          this.view.$('input#search-site').keyup();
          this.view.$('input#search-site').val('');
          expect(this.view.previousSearch).toEqual('before');
        });

      });

      describe("typing a term that is more than 3 characters", function() {

        it("should trigger a search:start event", function() {
          this.view.$('input#search-site').val('term');
          this.view.$('input#search-site').keyup();
          expect(this.bus).toHaveBeenCalledWith('search:start');
        });

        it("should trigger a search:term event after 500ms", function() {
          var clock = sinon.useFakeTimers();
          this.view.$('input#search-site').val('term');
          this.view.$('input#search-site').keyup();
          clock.tick(500);
          expect(this.bus).toHaveBeenCalledWith('search:term', {s: 'term'});
          clock.restore();
        });
      });

      describe("pressing the enter key", function() {

        it("should navigate to a URL with the term in the query string", function() {
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
